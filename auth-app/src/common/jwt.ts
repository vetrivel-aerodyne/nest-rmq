import { Injectable } from "@nestjs/common";

var jwt = require('jsonwebtoken');
const SecretKey ="RU1QTE9ZRUVTRUNSRVRLRVk=";
@Injectable()
export class JWTService{
    generateToken(data:object){
        return  jwt.sign(data,SecretKey);
    }
    
    verify(token:string){
      try{
        return jwt.verify(token,SecretKey);
      }catch(error){
        console.log("verify error=>",error);
        return false;
      }
    }

}