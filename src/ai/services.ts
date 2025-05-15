import { injectable } from 'inversify'
import OpenAI from 'openai'
import { AIRequestDto, myDelta } from './ai.dto'

@injectable()
export class AIService {
    private openai: OpenAI

    constructor() {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
        })
    }

    async generateResponseStream(
        request: AIRequestDto
    ): Promise<AsyncIterable<string>> {
        const stream = await this.openai.chat.completions.create({
            model: request.model,
            messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: request.content },
            ],
            stream: true,
        })

        // 包装为一个标准的 AsyncIterable<string>
        async function* yieldChunks() {
            for await (const chunk of stream) {
                const delta = chunk.choices?.[0]?.delta as myDelta
                if (delta.reasoning_content) {
                    yield JSON.stringify({
                      type: 'reasoning',
                      content: delta.reasoning_content,
                    })
                  }
              
                  if (delta.content) {
                    yield JSON.stringify({
                      type: 'output',
                      content: delta.content,
                    })
                  }
            }
        }

        return yieldChunks()
    }
}
