import { controller, httpPost as Post } from 'inversify-express-utils'
import { inject } from 'inversify'
import { Request, Response } from 'express'
import { AIService } from './services'
import { AIRequestDto } from './ai.dto'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { JwtService } from '../../jwt'

@controller('/ai')
export class AIController {
    constructor(@inject(AIService) private readonly aiService: AIService) {}

    @Post('/chat', JwtService.middleware())
    async chat(req: Request, res: Response) {
        try {
            // 设置响应头为 SSE（Server-Sent Events）
            res.setHeader('Content-Type', 'text/event-stream')
            res.setHeader('Cache-Control', 'no-cache')
            res.setHeader('Connection', 'keep-alive')
            res.flushHeaders?.() // 立即刷新 headers（防止客户端超时）
            // 验证请求数据

            // 将请求体转换为 DTO 对象并进行数据验证
            // 使用 class-transformer 将普通对象转换为类实例
            // 使用 class-validator 验证数据是否符合要求
            console.log(req.body)
            
            const requestDto = plainToClass(AIRequestDto, req.body)
            const errors = await validate(requestDto)

            if (errors.length > 0) {
                console.log('error')
                
                return res.status(400).json({
                    error: '请求数据验证失败',
                    details: errors,
                })
            }

            // 调用AI服务
            const stream = await this.aiService.generateResponseStream(
                requestDto
            )

            // 推送数据
            for await (const chunk of stream) {    
                console.log(chunk);
                        
                res.write(`data: ${chunk}\n\n`) 
            }
            // 标记结束
            // res.write(`data: [DONE]\n\n`) 
            res.end()
        } catch (error) {
            res.write(
                `event: error\ndata: ${JSON.stringify({
                    error: error.message,
                })}\n\n`
            )
            res.end()
        }
    }
}
