import config from 'config';
import { Configuration, OpenAIApi } from 'openai';
import { createReadStream } from 'fs';

class OpenAi {
  constructor(apiKey) {
    const configuration = new Configuration({
      apiKey: apiKey,
    });

    this.openai = new OpenAIApi(configuration);
  }

  async chat() {}

  async transcription(filePath) {
    try {
      const response = await this.openai.createTranscription(
        createReadStream(filePath),
        'whisper-1'
      );

      return response.data.text;
    } catch (err) {
      console.log('Error while transcription', err);
    }
  }
}

export const openai = new OpenAi(config.get('OPENAI_API_KEY'));
