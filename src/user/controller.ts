import {
    controller,
    httpGet as Get,
    httpPost as Post,
} from 'inversify-express-utils'
import { UserService } from './services'
import { inject } from 'inversify'
import type { Request, Response } from 'express'
import { JwtService } from '../../jwt'

@controller('/user')
export class User {
    constructor(
        @inject(UserService) private readonly userService: UserService,
        @inject(JwtService) private readonly jwtService: JwtService
    ) {}

    @Get('/index', JwtService.middleware())
    public async getIndex(req: Request, res: Response) {
        // console.log(req.user);
        let result = await this.userService.getList()
        res.send(result)
    }

    @Post('/create')
    public async createUser(req: Request, res: Response) {
        let requestBody = req.body
        let result = await this.userService.createUser(requestBody)
        res.send(result)
    }
    @Post('/login')
    public async login(req:Request,res:Response){
        try{
            const { username , password } = req.body
            const token = await this.userService.login(username,password)
            res.json({ code: 200, message: '登录成功', token })
        }catch(err){
            res.status(400).json({ code: 400, message: err.message })
        }

    }
}
