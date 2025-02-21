import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export class UserActor {
    static async signin(){

    }
    static async signup(req: Request, res: Response){
        // 1. get data 
        console.log(req)
        const {login, password} = req.body
        // 2. validate data
        if (!login || !password) {
            return res.send("Некорректные данные")
        }
        // 3. check Users on unique (DB)
        // const candidate = users.findOne({login})
        const candidate = {login: "petya", password: "vasya"}
        if (candidate) {
            return res.send("Логин занят")
        }
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
            // @ts-expect-error
            process.env.SECRET_KEY, 
            {expiresIn: '24h'}
        )
        return res.json({token})
    }
}


// curl --header "Content-Type: application/json" --request POST  --data '{"login":"xyz","password":"xyz"}' http://localhost:5000/user/signup