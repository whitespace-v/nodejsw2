import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { Responder } from "../middleware/Responder";

export class UserActor {
    static async signin(req: Request, res: Response){
        // 1. get data
        const {login, password} = req.body
        // 2. find User in DB by login
        const user = {
            id: 0,
            login,
            password: "$2b$05$VWC/H.674Jy1YPfQWLFjRO.zbP4BDOaEnRKRg8OeZ5EG/LRyoEJ7i"
        }
        if (!user){
            res.send("Пользователь не найден")
        } 
        // 3. compare passwords
        let pwdCompare = bcrypt.compareSync(password, user.password)
        if (!pwdCompare){
            res.send("Пароль неверный")
        }
        // 4. token
        const token = jwt.sign(
            {login: user.login},
            process.env.SECRET_KEY || "DEFAULT_SECRET_KEY", 
            {expiresIn: '24h'}
        )
        res.json({token, user})
    }
    static async signup(req: Request, res: Response){
        // 1. get data 
        const {login, password} = req.body
        // 2. validate data
        if (!login || !password) {
            res.send(Responder.forbidden("Некорректные данные"))
        }
        // 3. check Users on unique (DB)
        // const candidate = users.findOne({login})
        const candidate = {login: "petya", password: "vasya"}
        // if (candidate.login) {
        //     res.send(Responder.forbidden("Логин занят"))
        // }
        // 4. hash pwd
        const hashPassword = await bcrypt.hash(password, 5)
        // 5. create user (DB)
        const user = {
            login,
            password: hashPassword
        }
        // 6. login user
        const token = jwt.sign(
            {login: user.login},
            process.env.SECRET_KEY || "DEFAULT_SECRET_KEY", 
            {expiresIn: '24h'}
        )
        res.json(Responder.ok({token, user}))
    }
}


// curl --header "Content-Type: application/json" --request POST  --data '{"login":"xyz","password":"xyz"}' http://localhost:5000/user/signup