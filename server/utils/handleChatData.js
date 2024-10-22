"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const formatTime_1 = tslib_1.__importDefault(require("./formatTime"));
function handleOpenChatData(chunk, parentMessageId) {
    let lines = chunk.toString().split('\n');
    lines = lines.filter((item) => item.trim());
    const contents = [];
    let currentMessage = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        console.log("line", line);
        if (line.startsWith('event:')) {
            const event = line.split(':')[1].trim();
            i++; // Move to the next line (data line)
            if (i < lines.length) {
                const dataLine = lines[i];
                const payload = dataLine.replace(/^data:/, '').trim();
                try {
                    const parsedPayload = JSON.parse(payload);
                    
                    switch (event) {
                        case 'conversation.chat.created':
                        case 'conversation.chat.in_progress':
                            contents.push(JSON.stringify({
                                ...parsedPayload,
                                segment: 'start',
                                parentMessageId
                            }));
                            break;
                        case 'conversation.message.delta':
                            if (parsedPayload.type === 'answer') {
                                if (!currentMessage) {
                                    currentMessage = {
                                        id: parsedPayload.id,
                                        role: parsedPayload.role,
                                        segment: 'text',
                                        dateTime: parsedPayload.chat_id.split('-').slice(0, 3).join('-'),
                                        content: parsedPayload.content,
                                        parentMessageId,
                                        conversationId: parsedPayload.conversation_id,
                                        botId: parsedPayload.bot_id,
                                        contentType: parsedPayload.content_type,
                                        chatId: parsedPayload.chat_id
                                    };
                                    contents.push(JSON.stringify(currentMessage));
                                } else {
                                    currentMessage.content += parsedPayload.content;
                                    currentMessage.segment = 'text';
                                }
                                
                            }
                            break;
                        case 'conversation.message.completed':
                            if (currentMessage) {
                                currentMessage.segment = 'stop';
                                contents.push(JSON.stringify(parsedPayload));
                                currentMessage = null;
                            }
                            if (parsedPayload.type === 'verbose') {
                                // 可以在这里处理 verbose 类型的消息，如果需要的话
                                
                            }
                            break;
                        case 'conversation.chat.completed':
                            contents.push(JSON.stringify({
                                id: parsedPayload.id,
                                role: 'system',
                                segment: 'stop',
                                dateTime: new Date().toISOString().split('T')[0],
                                content: 'Chat completed',
                                parentMessageId,
                                conversationId: parsedPayload.conversation_id,
                                botId: parsedPayload.bot_id,
                                usage: parsedPayload.usage
                            }) + '\n\n');
                            break;
                        case 'done':
                            contents.push(JSON.stringify({
                                id: '',
                                role: 'system',
                                segment: 'stop',
                                dateTime: new Date().toISOString().split('T')[0],
                                content: '[DONE]',
                                parentMessageId
                            }) + '\n\n');
                            break;
                    }
                } catch (e) {
                    console.error("Error parsing payload:", e);
                    continue;
                }
            }
        }
    }

    return contents.join('');
}

exports.default = handleOpenChatData;
//# sourceMappingURL=handleChatData.js.map