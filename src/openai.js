import config from 'config';
import { Configuration, OpenAIApi } from 'openai';
import { createReadStream } from 'fs';

class OpenAi {
  roles = {
    ASSISTANT: 'assistant',
    USER: 'user',
    SYSTEM: 'system',
  };

  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async chat(messages) {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages,
      });

      return response.data.choices[0].message;
    } catch (err) {
      console.log('Error whild gpt chat', err.message);
    }
  }

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        'whisper-1'
      );

      return response.data.text;
    } catch (err) {
      console.log('Error while transcription', err.message);
    }
  }
}

export const openai = new OpenAi(config.get('OPENAI_API_KEY'));
