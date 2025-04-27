import 'reflect-metadata'
import { InversifyExpressServer } from "inversify-express-utils"
import { Container } from "inversify"
import { User } from './src/user/controller'
import { UserService } from './src/user/services'
import express from 'express'
import { PrismaClient } from '@prisma/client'
import { PrismaDB } from './src/db/index'

const container = new Container()

// User模块
container.bind(User).to(User)
container.bind(UserService).to(UserService)
// PrismaClient模块
container.bind<PrismaClient>('PrismaClient').toConstantValue(new PrismaClient())
container.bind<PrismaDB>(PrismaDB).to(PrismaDB)

const server = new InversifyExpressServer(container) 

server.setConfig((app: express.Application) => {
  app.use(express.json())
})
const app = server.build()

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})