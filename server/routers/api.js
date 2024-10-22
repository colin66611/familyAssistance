'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tslib_1 = require('tslib');
const express_1 = tslib_1.__importDefault(require('express'));
const redis_1 = tslib_1.__importDefault(require('../helpers/redis'));
const models_1 = require('../models');
const mailer_1 = tslib_1.__importDefault(require('../helpers/mailer'));
const gpt_tokens_1 = require('gpt-tokens');
const utils_1 = require('../utils');
const utils_2 = require('../utils');
const stream_1 = require('stream');
const node_fetch_1 = tslib_1.__importDefault(require('node-fetch'));
const queue_1 = require('../helpers/queue');
const alipay_1 = tslib_1.__importDefault(require('../helpers/alipay'));
const yipay_1 = tslib_1.__importDefault(require('../helpers/yipay'));
const router = express_1.default.Router();
router.get('/config', async (req, res, next) => {
    const shop_introduce = await models_1.configModel.getConfig('shop_introduce');
    const user_introduce = await models_1.configModel.getConfig('user_introduce');
    const notification = await models_1.notificationModel.getNotification({ page: 0, page_size: 1000 }, { status: 1 });
    const notifications = notification.rows.sort((a, b) => {
        return a.sort - b.sort;
    });
    res.json((0, utils_1.httpBody)(0, {
        shop_introduce,
        user_introduce,
        notifications: notifications
    }));
});
// 发送验证码
router.get('/send_sms', async (req, res, next) => {
    const source = Array.isArray(req.query.source)
    ? String(req.query.source[0])
    : String(req.query.source);
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^1[3456789]\d{9}$/;
    if(!emailRegex.test(source) && !phoneRegex.test(source)){
        res.json((0, utils_1.httpBody)(-1, '请输入正确邮箱或手机号'));
        return;
    }

    const code = await (0, utils_1.generateCode)();
    await redis_1.default.select(0).setex(`code:${source}`, code, 100);

    if (emailRegex.test(source)) {
        await mailer_1.default.send(source, `您的验证码为：${code}`);
    }

    res.json((0, utils_1.httpBody)(0, '发送成功'));
});
// 登陆注册
router.post('/login', async (req, res, next) => {
    const { account, code, password } = req.body;
    const ip = (0, utils_1.getClientIP)(req);
    if (!account || (!code && !password)) {
        res.status(406).json((0, utils_1.httpBody)(-1, '缺少必要参数'));
        return;
    }
    let userInfo = await models_1.userModel.getUserInfo({ account });
    if (account && code) {
        const redisCode = await redis_1.default.select(0).get(`code:${account}`);
        if (!redisCode) {
            res.status(406).json((0, utils_1.httpBody)(-1, '请先发送验证码'));
            return;
        }
        if (code !== redisCode) {
            res.status(406).json((0, utils_1.httpBody)(-1, '验证码不正确'));
            return;
        }
        await redis_1.default.select(0).del(`code:${account}`);
    }
    else if (account && password) {
        const md5Password = (0, utils_1.generateMd5)(password);
        if (!userInfo) {
            res.status(406).json((0, utils_1.httpBody)(-1, '用户不存在'));
            return;
        }
        if (userInfo.password !== md5Password) {
            res.status(406).json((0, utils_1.httpBody)(-1, '密码不正确'));
            return;
        }
    }
    let isSignin = 1;
    if (!userInfo) {
        isSignin = 0;
        // 新增
        try {
            const id = (0, utils_1.generateNowflakeId)(1)();
            const today = new Date();
            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
            const register_reward = (await models_1.configModel.getConfig('register_reward')) || 0;
            userInfo = await models_1.userModel
                .addUserInfo((0, utils_1.filterObjectNull)({
                id,
                account,
                ip,
                nickname: 'Chat用户',
                avatar: 'https://u1.dl0.cn/icon/1682426702646avatarf3db669b024fad66-1930929abe2847093.png',
                status: 1,
                role: 'user',
                password: (0, utils_1.generateMd5)((0, utils_1.generateMd5)((0, utils_1.generateUUID)() + Date.now().toString())),
                integral: Number(register_reward),
                vip_expire_time: (0, utils_2.formatTime)('yyyy-MM-dd', yesterday),
                svip_expire_time: (0, utils_2.formatTime)('yyyy-MM-dd', yesterday)
            }))
                .then((addRes) => {
                const turnoverId = (0, utils_1.generateNowflakeId)(1)();
                models_1.turnoverModel.addTurnover({
                    id: turnoverId,
                    user_id: id,
                    describe: '注册奖励',
                    value: `${register_reward}积分`
                });
                return addRes;
            });
        }
        catch (error) {
            res.status(500).json((0, utils_1.httpBody)(-1, '服务器错误'));
            return;
        }
    }
    else {
        models_1.actionModel.addAction({
            id: (0, utils_1.generateNowflakeId)(23)(),
            user_id: userInfo.id,
            ip,
            type: 'login',
            describe: '登录页面'
        });
    }
    const token = await (0, utils_1.generateToken)(userInfo);
    console.log('userInfo', userInfo);
    await redis_1.default.select(1).setex(`token:${token}`, JSON.stringify(userInfo), 100000);
    if (isSignin === 1) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startTime = (0, utils_2.formatTime)('yyyy-MM-dd HH:mm:ss', today);
        isSignin = await models_1.signinModel.getUserDaySignin(userInfo.id, startTime);
    }
    res.json((0, utils_1.httpBody)(0, {
        user_info: {
            ...userInfo,
            is_signin: isSignin ? 1 : 0
        },
        token
    }, '登陆成功'));
});
// 获取用户信息
router.get('/user/info', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const userInfo = await models_1.userModel.getUserInfo({ id: user_id });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTime = (0, utils_2.formatTime)('yyyy-MM-dd HH:mm:ss', today);
    const isSignin = await models_1.signinModel.getUserDaySignin(userInfo.id, startTime);
    res.status(200).json((0, utils_1.httpBody)(0, {
        ...userInfo,
        is_signin: isSignin ? 1 : 0
    }));
});
// 修改用户密码
router.put('/user/password', async (req, res, next) => {
    const { account, code, password } = req.body;
    if (!account || !code || !password) {
        res.status(406).json((0, utils_1.httpBody)(-1, '缺少必要参数'));
        return;
    }
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const redisCode = await redis_1.default.select(0).get(`code:${account}`);
    if (code !== redisCode) {
        res.status(406).json((0, utils_1.httpBody)(-1, '验证码不正确'));
        return;
    }
    await redis_1.default.select(0).del(`code:${account}`);
    const ip = (0, utils_1.getClientIP)(req);
    await models_1.userModel.editUserInfo(user_id, {
        password: (0, utils_1.generateMd5)(password),
        ip
    });
    models_1.actionModel.addAction({
        user_id,
        id: (0, utils_1.generateNowflakeId)(23)(),
        ip,
        type: 'reset_password',
        describe: '重置密码密码'
    });
    res.status(200).json((0, utils_1.httpBody)(0, '重置密码成功'));
});
// 获取用户签到日历
router.get('/signin/list', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const date = new Date();
    const start_time = (0, utils_2.formatTime)('yyyy-MM-dd HH:mm:ss', new Date(date.getFullYear(), date.getMonth(), 1));
    const end_time = (0, utils_2.formatTime)('yyyy-MM-dd HH:mm:ss', new Date(date.getFullYear(), date.getMonth() + 1, 1));
    const list = await models_1.signinModel.getUserSigninList(user_id, {
        start_time,
        end_time
    });
    res.status(200).json((0, utils_1.httpBody)(0, list));
});
// 绘画
router.post('/images/generations', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const { prompt, n = 1, size = '256x256', response_format = 'url' } = req.body;
    const userInfo = await models_1.userModel.getUserInfo({
        id: user_id
    });
    const ip = (0, utils_1.getClientIP)(req);
    let deductIntegral = 0;
    const drawUsePrice = await models_1.configModel.getConfig('draw_use_price');
    if (drawUsePrice) {
        const drawUsePriceJson = JSON.parse(drawUsePrice.toString());
        for (const item of drawUsePriceJson) {
            if (item.size === size) {
                deductIntegral = Number(item.integral);
            }
        }
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const vipExpireTime = new Date(userInfo.vip_expire_time).getTime();
    if (!(userInfo.integral > deductIntegral || vipExpireTime >= todayTime)) {
        res.status(400).json((0, utils_1.httpBody)(-1, [], '余额不足'));
        return;
    }
    const tokenInfo = await models_1.tokenModel.getOneToken({ model: 'dall-e' });
    if (!tokenInfo || !tokenInfo.id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '未配置对应模型'));
        return;
    }
    queue_1.checkTokenQueue.addTask({
        ...tokenInfo
    });
    const generations = await (0, node_fetch_1.default)(`${tokenInfo.host}/v1/images/generations`, {
        method: 'POST',
        body: JSON.stringify({
            prompt,
            n,
            size,
            response_format
        }),
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenInfo.key}`
        }
    });
    if (generations.status !== 200) {
        res.status(generations.status).json((0, utils_1.httpBody)(-1, [], '生成失败'));
        return;
    }
    const { data } = (await generations.json());
    if (vipExpireTime < todayTime) {
        models_1.userModel.updataUserVIP({
            id: user_id,
            type: 'integral',
            value: deductIntegral,
            operate: 'decrement'
        });
        const turnoverId = (0, utils_1.generateNowflakeId)(1)();
        models_1.turnoverModel.addTurnover({
            id: turnoverId,
            user_id,
            describe: `绘画 ${size}`,
            value: `-${deductIntegral}积分`
        });
    }
    models_1.actionModel.addAction({
        user_id,
        id: (0, utils_1.generateNowflakeId)(23)(),
        ip,
        type: 'draw',
        describe: `绘画(${size})`
    });
    res.json((0, utils_1.httpBody)(0, data));
});
// 对话
router.post('/chat/completions', async (req, res, next) => {
    // 获取用户ID和信息
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const userInfo = await models_1.userModel.getUserInfo({
        id: user_id
    });
    const ip = (0, utils_1.getClientIP)(req);

    // 获取请求参数
    const { prompt, parentMessageId } = req.body;
    const options = {
        frequency_penalty: 0,
        model: 'coze',  //hardcoding默认的大模型
        presence_penalty: 0,
        temperature: 0,
        max_tokens: 2000,
    };

    // 检查用户权限和余额
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    const vipExpireTime = new Date(userInfo.vip_expire_time).getTime();
    const svipExpireTime = new Date(userInfo.svip_expire_time).getTime();
    if (!(userInfo.integral > 0 || vipExpireTime >= todayTime)) {
        res.status(400).json((0, utils_1.httpBody)(-1, [], '余额不足'));
        return;
    }

    // 获取coze模型token信息
    const tokenInfo = await models_1.tokenModel.getOneToken({ model: options.model }); 
    if (!tokenInfo || !tokenInfo.id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '未配置对应AI模型'));
        return;
    }
    queue_1.checkTokenQueue.addTask({
        ...tokenInfo
    });
    console.log('tokenInfo', tokenInfo);

    let conversation_id = "";

    // 创建会话，存储会话ID
    // 如果parentMessageId是空，则需要创建会话 TBD:看前端代码，把初始conversation_id设为空，conversation_id由接口返回
    if(parentMessageId != null) {
        const conversation = await fetch(`${tokenInfo.host}/v1/conversation/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${tokenInfo.key}`,
            },
        });
        if(conversation.status == 200) {
            const conversationData = await conversation.json();
            conversation_id = conversationData.data.id;
            console.log("conversation_id is null, now it's ", conversation_id);
            //TBD: 持久化conversation_id
        }else {
            console.error("conversation_id is null, but create conversation failed with code", conversation.status);
        }
    }else{
        conversation_id = parentMessageId;
        console.log("conversation_id is not null, it's ", conversation_id);
    }

    const assistantMessageId = (0, utils_1.generateNowflakeId)(2)();
    const userMessageId = (0, utils_1.generateNowflakeId)(1)();
    const userMessageInfo = {
        user_id,
        id: userMessageId,
        role: 'user',
        content: prompt,
        parent_message_id: parentMessageId,
        ...options
    };
    const assistantInfo = {
        user_id,
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        parent_message_id: parentMessageId,
        ...options
    };

    const { Readable } = require('stream');
    console.log("tokeninfo.key:", tokenInfo.key);
    console.log("tokeninfo.host:", tokenInfo.host);
    
    // 发送AI chat请求
    const chat = await handleCozeAPI({
        messages: req.body.prompt,
        model: options.model,
        user: userInfo.id,
        stream: true,
        conversation_id: conversation_id,
    }, tokenInfo.key, tokenInfo.host);
    //chat.conversation_id = conversation_id;

    console.log("chat", chat);
    if (chat.status === 200) {     // 当前只处理流式响应，原本应该在这个if中判断是否为流式
        const ai3_ratio = (await models_1.configModel.getConfig('ai3_ratio')) || 0;
        const ai4_ratio = (await models_1.configModel.getConfig('ai4_ratio')) || 0;
        const aiRatioInfo = {
            ai3_ratio,
            ai4_ratio
        };
        console.log("aiRatioInfo", aiRatioInfo);
        
        res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders(); // 立即发送头部
        const jsonStream = new stream_1.Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                const bufferString = Buffer.from(chunk).toString();
                
                const processedData = (0, utils_1.handleChatData)(bufferString, conversation_id);//看起来的确这个函数有bug，导致formattedData的内容为多行内容
                
                // 确保 processedData 是一个字符串
                const dataString = typeof processedData === 'string' ? processedData : JSON.stringify(processedData);

                // 格式化为事件流格式
                const formattedData = `data: ${dataString}\n\n`;
                console.log("Formatted data:", formattedData);

                callback(null, formattedData);

            }
        });

        // Convert ReadableStream to Node.js Readable stream
        const nodeReadable = Readable.from(chat.body);

        nodeReadable.pipe(jsonStream).pipe(res);

        // 在 jsonStream 上添加事件监听器
        jsonStream.on('data', (chunk) => {
            //console.log("Data processed by jsonStream:", chunk.toString());
        });
        
        jsonStream.on('end', () => {
            console.log("jsonStream processing ended");
        });

        res.on('data', (chunk) => {
            //console.log("Sending chunk to client:", chunk.toString());
        });
          
        res.on('end', () => {
            console.log("Finished sending response to client");
        });

        // 如果 res 确实是一个可写流，我们可以监听它的 'finish' 事件
        res.on('finish', () => {
            console.log("Response finished sending");
        });

    }
    
    return;
});
// 新增兼容性处理函数
async function handleCozeAPI(data, authHeader, host) {
    console.log("authHeader:", authHeader);
    const messages = data.messages;
    if (!messages) {
        console.error("Invalid or missing messages array");
        throw new Error("Invalid request: messages is missing");
    }    
    const model = data.model;
    const user = data.user;
    const conversation_id = data.conversation_id;
    const stream = data.stream !== undefined ? data.stream : false;
    const bot_id = "7425621268382564393";   //hard code here, need to be moved to config
    const additional_messages = [];
    additional_messages.push({
        role: "user",
        content: messages,
        content_type: "text"
    });
    
    const requestBody = {
      stream: stream,
      user_id: user.toString(),
      bot_id: bot_id,
      additional_messages:additional_messages
    };
    const coze_api_url = `${host}/v3/chat`;
    const url = new URL(coze_api_url)
    url.searchParams.append('conversation_id', conversation_id);

    const requestDetails = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authHeader}`,
        },
        body: JSON.stringify(requestBody),
    };
    //console.log("requestDetails:", requestDetails);

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authHeader}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (!resp.ok) {
      throw new Error(`Error: ${resp.status} ${resp.statusText}`);
    }
    //console.log("resp:", resp);
    return resp;
  }

// 获取商品
router.get('/product', async (req, res, next) => {
    const { page, page_size } = (0, utils_1.pagingData)({
        page: req.query.page,
        page_size: 1000
    });
    const products = await models_1.productModel.getProducts({
        page,
        page_size
    }, {
        status: 1
    });
    const pay_types = await models_1.paymentModel.getPaymentTypes();
    res.json((0, utils_1.httpBody)(0, {
        products: products.rows,
        pay_types
    }));
});
// 使用卡密
router.post('/use_carmi', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const { carmi } = req.body;
    const carmiInfo = await models_1.carmiModel
        .getCarmiInfo({
        key: carmi
    })
        .then((i) => i?.toJSON());
    if (!carmiInfo) {
        res.status(400).json((0, utils_1.httpBody)(-1, '卡密不存在'));
        return;
    }
    if (carmiInfo.user_id || Number(carmiInfo.status) === 1) {
        res.status(500).json((0, utils_1.httpBody)(-1, '卡密已被使用'));
        return;
    }
    if (Number(carmiInfo.status) === 2) {
        res.status(500).json((0, utils_1.httpBody)(-1, '卡密已过期'));
        return;
    }
    const currentTime = new Date().setHours(0, 0, 0, 0);
    const endTime = Date.parse(carmiInfo.end_time);
    if (carmiInfo.end_time && endTime < currentTime) {
        res.status(500).json((0, utils_1.httpBody)(-1, '卡密已过期'));
        return;
    }
    const ip = (0, utils_1.getClientIP)(req);
    const useCarmi = await models_1.carmiModel.updateCarmiInfo({
        user_id,
        status: 1,
        ip
    }, {
        id: carmiInfo.id,
        key: carmi
    });
    if (!useCarmi[0]) {
        res.status(500).json((0, utils_1.httpBody)(-1, '使用卡密失败，请稍后再试'));
        return;
    }
    await models_1.actionModel.addAction({
        user_id,
        id: (0, utils_1.generateNowflakeId)(23)(),
        ip,
        type: 'use_carmi',
        describe: '使用卡密'
    });
    // 开始增加到用户身上
    await models_1.userModel.updataUserVIP({
        id: user_id,
        value: carmiInfo.value,
        level: carmiInfo.level,
        type: carmiInfo.type,
        operate: 'increment'
    });
    const turnoverId = (0, utils_1.generateNowflakeId)(1)();
    const levelMap = {
        1: '(会员)',
        2: '(超级会员)',
        default: '(积分)'
    };
    const typeText = carmiInfo.type === 'day' ? levelMap[carmiInfo.level] || '(天数)' : levelMap.default;
    await models_1.turnoverModel.addTurnover({
        id: turnoverId,
        user_id,
        describe: `卡密充值 ${typeText}`,
        value: `${carmiInfo.value}${carmiInfo.type === 'day' ? '天' : '积分'}`
    });
    res.json((0, utils_1.httpBody)(0, '使用卡密成功'));
});
// 获取用户使用记录
router.get('/turnover', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const { page, page_size } = (0, utils_1.pagingData)({
        page: req.query.page,
        page_size: req.query.page_size
    });
    const userTurnovers = await models_1.turnoverModel.getUserTurnovers({ page, page_size }, {
        user_id
    });
    res.json((0, utils_1.httpBody)(0, userTurnovers));
});
// 签到
router.post('/signin', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startTime = (0, utils_2.formatTime)('yyyy-MM-dd HH:mm:ss', today);
    const isSignin = await models_1.signinModel.getUserDaySignin(user_id, startTime);
    if (isSignin) {
        res.status(500).json((0, utils_1.httpBody)(-1, '今日已经签到了'));
        return;
    }
    const signin_reward = (await models_1.configModel.getConfig('signin_reward')) || 0;
    const ip = (0, utils_1.getClientIP)(req);
    const id = (0, utils_1.generateNowflakeId)(1)();
    const turnoverId = (0, utils_1.generateNowflakeId)(1)();
    models_1.actionModel.addAction({
        user_id,
        id: (0, utils_1.generateNowflakeId)(23)(),
        ip,
        type: 'signin',
        describe: '签到'
    });
    await models_1.signinModel.addSignin({
        id,
        user_id,
        ip
    });
    await models_1.userModel.updataUserVIP({
        id: user_id,
        value: Number(signin_reward),
        type: 'integral',
        operate: 'increment'
    });
    await models_1.turnoverModel.addTurnover({
        id: turnoverId,
        user_id,
        describe: '签到奖励',
        value: `${signin_reward}积分`
    });
    res.json((0, utils_1.httpBody)(0, `签到成功 +${signin_reward}积分`));
});
// 创建支付订单
router.post('/pay/precreate', async (req, res, next) => {
    const user_id = req?.user_id;
    if (!user_id) {
        res.status(500).json((0, utils_1.httpBody)(-1, '服务端错误'));
        return;
    }
    const { quantity = 1, pay_type, product_id } = req.body;
    if (!pay_type || !product_id) {
        res.status(406).json((0, utils_1.httpBody)(-1, '缺少必要参数'));
        return;
    }
    // 获取商品信息
    const productInfo = await models_1.productModel.getProduct(product_id);
    if (!productInfo) {
        res.status(406).json((0, utils_1.httpBody)(-1, '商品不存在'));
        return;
    }
    // 获取支付信息
    const paymentInfo = await models_1.paymentModel.getOnePayment(pay_type);
    if (!paymentInfo) {
        res.status(406).json((0, utils_1.httpBody)(-1, '支付信息未配置'));
        return;
    }
    const out_trade_no = (0, utils_1.generateNowflakeId)(1)();
    const responseData = {
        channel: paymentInfo.channel,
        order_id: out_trade_no,
        pay_url: '',
        pay_type
    };
    const ip = (0, utils_1.getClientIP)(req);
    // const getServerUrl = () => {
    //   const host = req.get('host') || ''
    //   if (host.includes(':443')) {
    //     return `https://${host.split(':')[0]}`
    //   }
    //   return `${req.protocol}://${host.split(':')[0]}`
    // }
    const notifyUrl = `https://${req.get('host')?.split(':')[0]}/api/pay/notify?channel=${paymentInfo.channel}`;
    const amount = productInfo.price / 100;
    const paymentParams = JSON.parse(paymentInfo.params);
    const paramsStringify = JSON.stringify({
        order_id: out_trade_no,
        product_id,
        user_id,
        payment_id: paymentInfo.id
    });
    models_1.actionModel.addAction({
        user_id,
        id: (0, utils_1.generateNowflakeId)(23)(),
        ip,
        type: 'pay_order',
        describe: '创建支付订单'
    });
    if (paymentInfo.channel === 'alipay') {
        const alipayPrecreate = await alipay_1.default.precreate({
            config: paymentParams,
            notify_url: notifyUrl,
            out_trade_no,
            total_amount: amount,
            subject: productInfo.title,
            body: paramsStringify,
            goods_detail: {
                goods_id: productInfo.id,
                goods_name: productInfo.title,
                price: amount,
                quantity
            }
        });
        if (alipayPrecreate.code) {
            res.status(500).json((0, utils_1.httpBody)(-1, '支付错误，稍后再试'));
            return;
        }
        responseData.order_id = alipayPrecreate.outTradeNo;
        responseData.pay_url = alipayPrecreate.qrCode;
    }
    if (paymentInfo.channel === 'yipay') {
        const yipayPrecreate = await yipay_1.default.precreate({
            api: paymentParams.api,
            key: paymentParams.key
        }, {
            pid: Number(paymentParams.pid),
            return_url: paymentParams?.return_url
        }, {
            type: pay_type,
            out_trade_no,
            notify_url: notifyUrl,
            name: productInfo.title,
            money: amount,
            clientip: ip,
            param: encodeURIComponent(paramsStringify)
        });
        if (yipayPrecreate.code) {
            res.status(500).json((0, utils_1.httpBody)(-1, '支付错误，稍后再试'));
            return;
        }
        responseData.pay_url = yipayPrecreate.pay_url;
    }
    await models_1.orderModel.addOrder({
        id: out_trade_no,
        pay_type,
        product_title: productInfo.title,
        product_id,
        trade_status: 'TRADE_AWAIT',
        user_id,
        product_info: JSON.stringify(productInfo),
        channel: paymentInfo.channel,
        payment_id: paymentInfo.id,
        payment_info: JSON.stringify(paymentInfo),
        money: amount,
        params: paramsStringify,
        ip,
        pay_url: responseData.pay_url
    });
    res.json((0, utils_1.httpBody)(0, responseData));
});
// 支付通知
router.all('/pay/notify', async (req, res, next) => {
    const checkNotifySign = async (payment_id, data, channel) => {
        const paymentInfo = await models_1.paymentModel.getPaymentInfo(payment_id);
        if (!paymentInfo) {
            return false;
        }
        const config = JSON.parse(paymentInfo.params);
        if (channel === 'alipay') {
            const isCheck = await alipay_1.default.checkNotifySign(config, data);
            if (!isCheck) {
                return false;
            }
        }
        if (channel === 'yipay') {
            const isCheck = await yipay_1.default.checkNotifySign(data, config.key);
            if (!isCheck) {
                return false;
            }
        }
        return true;
    };
    const batchModify = async ({ order_id, trade_status, trade_no, notify_info, user_id, product_id }) => {
        // 新增用户余额
        const addQuotaInfo = await models_1.userModel.addUserProductQuota(user_id, product_id);
        if (addQuotaInfo.code) {
            return false;
        }
        // 修改订单信息
        await models_1.orderModel.editOrder({
            id: order_id,
            trade_status,
            trade_no,
            notify_info
        });
        // 加个账单
        const turnoverId = (0, utils_1.generateNowflakeId)(1)();
        await models_1.turnoverModel.addTurnover({
            id: turnoverId,
            user_id,
            describe: `购买-${addQuotaInfo.data?.title}`,
            value: addQuotaInfo.data?.value
        });
        return true;
    };
    try {
        if (req.body?.channel && req.body?.channel === 'alipay') {
            const { body, out_trade_no, trade_status, trade_no } = req.body;
            const orderInfo = await models_1.orderModel.getOrderInfo(out_trade_no);
            if (!orderInfo || orderInfo.trade_status !== 'TRADE_AWAIT') {
                res.json('fail');
                return;
            }
            const { payment_id, user_id, product_id } = JSON.parse(body);
            const isCheck = await checkNotifySign(payment_id, req.body, req.body?.channel);
            if (!isCheck) {
                res.json('fail');
                return;
            }
            const modifyResult = await batchModify({
                order_id: out_trade_no,
                trade_status,
                trade_no,
                notify_info: JSON.stringify(req.body),
                user_id,
                product_id
            });
            if (!modifyResult) {
                res.json('fail');
                return;
            }
        }
        if (req.query?.channel && req.query?.channel === 'yipay') {
            const { out_trade_no, trade_status, trade_no } = req.query;
            const orderInfo = await models_1.orderModel.getOrderInfo(out_trade_no);
            if (!orderInfo || orderInfo.trade_status !== 'TRADE_AWAIT') {
                res.json('fail');
                return;
            }
            const { payment_id, user_id, product_id } = JSON.parse(decodeURIComponent(req.query?.param));
            const isCheck = await checkNotifySign(payment_id, req.query, req.query?.channel);
            if (!isCheck) {
                res.json('fail');
                return;
            }
            const modifyResult = await batchModify({
                order_id: out_trade_no,
                trade_status,
                trade_no,
                notify_info: JSON.stringify(req.query),
                user_id,
                product_id
            });
            if (!modifyResult) {
                res.json('fail');
                return;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
    res.json('success');
});
exports.default = router;
//# sourceMappingURL=api.js.map