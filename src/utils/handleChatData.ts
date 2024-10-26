interface ChatDataItem {
  id: string;
  role: string;
  segment: string;
  dateTime: string;
  content: string;
  parentMessageId: string;
  conversationId: string;
  botId: string;
  contentType: string;
  chatId: string;
}

export function handleChatData(data: string): ChatDataItem[] {
  const result: ChatDataItem[] = [];
  const lines = data.split('\n');

  for (const line of lines) {
    try {
      console.log('line: ', line.toString());
      if (line) {
        const parsedData: ChatDataItem = JSON.parse(line);
        result.push(parsedData);
      }
    } catch (error) {
      console.error('Error parsing JSON:', error, 'Raw data:', line);
    }
  }

  return result;
}