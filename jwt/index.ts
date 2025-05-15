import { injectable } from "inversify"
import passport from "passport"
import jsonwebtoken from "jsonwebtoken"
import { Strategy, ExtractJwt } from "passport-jwt"

@injectable()
export class JwtService {
    private secretKey: string = "shibosadaswda"
    private jwtOptions: object = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: this.secretKey,
    }
    constructor() {
        this.strategy()
    }

    strategy(){
        let str = new Strategy(this.jwtOptions,(jwtPayload,done)=>{
            // 这里可以根据 jwtPayload 中的信息查询用户信息
            // 例如：User.findById(jwtPayload.id)
            // 如果找到用户，则调用 done(null, user)
            done(null, jwtPayload)
            
        })
        passport.use(str)
    }
    static middleware(){
        // 这里是中间件函数
        return passport.authenticate("jwt",{session:false})
    }
    //  token
    public createToken(user: { id: number; username: string }){
        const payload = {
            useId :user.id,
            username: user.username
        }
        return jsonwebtoken.sign(payload,this.secretKey,{expiresIn:"1h"})
    }
    //关联express
    public init (){
        return passport.initialize()
    }
}