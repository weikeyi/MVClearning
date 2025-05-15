import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsArray,
} from 'class-validator'
import { Transform } from 'class-transformer'

export class AIRequestDto {
    @IsNotEmpty({ message: '消息内容不能为空' })
    @IsString()
    @Transform(({ value }) => value?.trim())
    content: string

    @IsOptional()
    @IsNumber()
    temperature?: number = 0.7

    @IsOptional()
    @IsNumber()
    maxTokens?: number = 1000

    @IsOptional()
    @IsString()
    model?: string = 'deepseek-r1'
}

export class AIResponseDto {
    content: string
    usage?: {
        prompt_tokens: number
        completion_tokens: number
        total_tokens: number
    }
}
export type myDelta = {
  reasoning_content?: string;
  content?: string;
}