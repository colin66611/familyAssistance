"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const formatTime_1 = tslib_1.__importDefault(require("./formatTime"));
function handleOpenChatData(chunk, parentMessageId) {
    // 将字符串按照换行符进行分割
    let lines = chunk.toString().split('\n');
    // 过滤掉空白的消息
    lines = lines.filter((item) => item.trim());
    const contents = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.startsWith('event:conversation.message.delta')) {
            // 跳过事件行，处理下一行的数据
            i++;
            if (i < lines.length) {
                const dataLine = lines[i];
                const payload = dataLine.replace(/^data:/, '').trim();
                try {
                    const parsedPayload = JSON.parse(payload);
                    const segment = parsedPayload.type === 'answer' ? 'text' : 'start';
                    contents.push(JSON.stringify({
                        id: parsedPayload.id,
                        role: parsedPayload.role,
                        segment,
                        dateTime: parsedPayload.chat_id.split('-').slice(0, 3).join('-'),
                        content: parsedPayload.content,
                        parentMessageId,
                        conversationId: parsedPayload.conversation_id,
                        botId: parsedPayload.bot_id,
                        contentType: parsedPayload.content_type,
                        chatId: parsedPayload.chat_id
                    }) + '\n\n');
                } catch (e) {
                    // 忽略无法解析为 JSON 的消息
                    continue;
                }
            }
        }
    }

    // 添加结束标记
    contents.push(JSON.stringify({
        id: '',
        role: 'assistant',
        segment: 'stop',
        dateTime: new Date().toISOString().split('T')[0],
        content: '',
        parentMessageId
    }));

    return contents.join('');
}
exports.default = handleOpenChatData;
//# sourceMappingURL=handleChatData.js.map