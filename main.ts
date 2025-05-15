import 'reflect-metadata'
import 'dotenv/config'
import { InversifyExpressServer } from "inversify-express-utils"
import { Container } from "inversify"
import { User } from './src/user/controller'
import { UserService } from './src/user/services'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaDB } from './src/db/index'
import { JwtService } from './jwt/index'
import { AIController } from './src/ai/controller'
import { AIService } from './src/ai/services'
import cors from 'cors'

const container = new Container()

// User模块
container.bind(User).to(User)
container.bind(UserService).to(UserService)
// PrismaClient模块
container.bind<PrismaClient>('PrismaClient').toConstantValue(new PrismaClient())
container.bind<PrismaDB>(PrismaDB).to(PrismaDB)
// Jwt模块
container.bind<JwtService>(JwtService).to(JwtService)
// AI模块
container.bind(AIController).to(AIController)
container.bind(AIService).to(AIService)

const server = new InversifyExpressServer(container) 

server.setConfig((app: express.Application) => {
  app.use(express.json())
  app.use(cors()) 
  app.use(container.get(JwtService).init()) // 初始化 passport 中间件
})
const app = server.build()

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})