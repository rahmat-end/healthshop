import { Repository } from "typeorm"
import { User } from "../entities/User"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
import { userSchema, loginSchema } from "../utils/UserValidator"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

export default new class UserServices {
    private readonly UserRepository: Repository<User> = AppDataSource.getRepository(User)
    // async find(req: Request, res: Response): Promise<Response> {
    //     try {
    //       const userQuery = await this.UserRepository.find({ 
    //         order: { usr_id: "ASC" },
    //         relations: { opd: true }
    //       })

    //       const users = userQuery.map((user) => ({
    //         usr_id: user.usr_id,
    //         nip: user.nip,
    //         name: user.name,
    //         privilege: user.privilege,
    //         opd: user.opd.opd_id,
    //         opd_name: user.opd.name
    //       }));

    //       return res.status(200).json({
    //         status: "success",
    //         data: users,
    //         message: "Successfully! All record has been fetched"
    //       })
    //     } catch (err) {
    //       return res.status(500).json({ message: "Something error while finding all user"})
    //     }
    // }

    async register(req: Request, res: Response): Promise<Response> {
        try {
            //throw new Error(`Debug Info: ${JSON.stringify('cek cokkk')}`);
            const body = req.body

            const { error, value } = userSchema.validate(body)
            if(error) return res.status(409).json({ message: error.message })

            const isUsernameUsed = await this.UserRepository.findOne({ where: { username: value.username } })
            if(isUsernameUsed) return res.status(200).json({ message: "Username already in use !" })
            
            const getUser = await this.UserRepository.find()
            let isPasswordUsed: any
            for (let i = 0; i < getUser.length; i++) {
                if(await bcrypt.compare(value.password, getUser[i].password)) {
                isPasswordUsed = true
                break 
                } else {
                isPasswordUsed = false
                }
            }
            if(isPasswordUsed) return res.status(200).json({ message: "Password already in use !" })

            const hashPassword = await bcrypt.hash(value.password, 10)
            const obj = this.UserRepository.create({
                name: value.name,
                username: value.username,
                password: hashPassword
            })

            const user = await this.UserRepository.save(obj)
            return res.status(200).json({
                status: "success",
                data: {
                    ...user,
                    password_before_hash: value.password
                },
                message: "Successfully! Record has been added"
            })
        } catch (err) {
            return res.status(500).json({ message: "Something error while inserting data user"})
        }
    }

    async login(req: Request, res: Response): Promise<Response> {
        try {
            const body = req.body

            const { error, value } = loginSchema.validate(body)
            if(error) return res.status(409).json({ message: error.message })

            const isUsernameRegistered = await this.UserRepository.findOne({ 
                where: { username: value.username }
            })
            if(!isUsernameRegistered) return res.status(200).json({ message: "Username is not registered !" })

            const isMatchPassword = await bcrypt.compare(value.password, isUsernameRegistered.password)
            if(!isMatchPassword) return res.status(200).json({ message: "Incorrect password !" })

            const obj = {
                usr_id: isUsernameRegistered.usr_id,
                name: isUsernameRegistered.name,
                username: isUsernameRegistered.username
            }

            const token = jwt.sign({ obj }, 'SECRET_KEY', { expiresIn: 3600 })

            return res.status(200).json({
                status: "success",
                session: obj,
                token: token,
                message: "Successfully! Token has been assigned & Login session has been created"
            })
        } catch (err) {
            return res.status(500).json({ message: "Something error while login"})
        }
    }

    async check(req: Request, res: Response) : Promise<Response> {
        try {
          const loginSession = res.locals.loginSession
          const user = await this.UserRepository.findOne({
            where: {
              usr_id: loginSession.obj.usr_id
            }
          })
    
          return res.status(200).json({
            status: "success",
            data: user,
            message: "Token is valid!"
          })
        } catch (err) {
          return res.status(500).json({ message: "Something went wrong on the server!"})
        }
    }
}