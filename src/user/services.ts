import { injectable, inject} from "inversify"
import { PrismaDB } from "../db/index"
import { UserDto } from "./user.dto"
import { plainToClass } from "class-transformer"
import { validate } from "class-validator"
import express from "express"

@injectable()
export class UserService {

    constructor(@inject(PrismaDB) private readonly PrismaDB: PrismaDB){

    }

    public async getList(){
        return await this.PrismaDB.prisma.user.findMany({})
    }

    public async createUser(user:UserDto){
        let userDto = plainToClass(UserDto, user)
        const errors = await validate(userDto)
        if (errors.length ) {
            // 处理验证错误
            console.log(errors)
            throw new Error('Validation failed!') // 可以根据需要抛出自定义错误
        }else{
            return await this.PrismaDB.prisma.user.create({
                data: user
            })
        }


    }
}