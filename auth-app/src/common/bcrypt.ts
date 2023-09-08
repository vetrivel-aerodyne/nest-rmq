import { Injectable } from "@nestjs/common";

const bcrypt = require('bcrypt');
// import bcrypt from 'bcrypt';
@Injectable()
export class BcryptService{
    async hashPassword(password:string):Promise<string>{
        console.log("password==>",password);
        let hashedPassword = await bcrypt.hash(password,1);
        console.log("hashedPassword==>",hashedPassword);
        return hashedPassword;
    }

    async comparePassword(password:string,hashedPassword:string):Promise<string>{
        let compareResult = await bcrypt.compareSync(password,hashedPassword);
        console.log("compareResult==>",compareResult);
        return compareResult;
    }
}