import { injectable, inject } from 'inversify'
import { PrismaDB } from '../db/index'
import { UserDto } from './user.dto'
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'
import { JwtService } from '../../jwt'

@injectable()
export class UserService {
    constructor(
        @inject(PrismaDB) private readonly PrismaDB: PrismaDB,
        @inject(JwtService) private readonly JwtService: JwtService
    ) {}

    public async getList() {
        return await this.PrismaDB.prisma.user.findMany({})
    }

    public async createUser(user: UserDto) {
        let userDto = plainToClass(UserDto, user)
        const errors = await validate(userDto)
        if (errors.length) {
            // 处理验证错误
            console.log(errors)
            throw new Error('Validation failed!') // 可以根据需要抛出自定义错误
        } else {
            const result = await this.PrismaDB.prisma.user.create({
                data: user,
            })
            return {
                ...result,
                token: this.JwtService.createToken(result),
            }
        }
    }
    public async findUserByname(username: string) {
        const user = await this.PrismaDB.prisma.user.findUnique({
            where: { username },
        })
        return user
    }
    public async login(username:string,password:string){
        const user = await this.findUserByname(username)
        if(!user){
            throw new Error ('用户不存在') 
        }
        const isPasswordValid = password === user.password
        if(!isPasswordValid){
            throw new Error ('密码错误') 
        }
        return this.JwtService.createToken({
            id: user.id,
            username: user.username,
        })
    }
}
