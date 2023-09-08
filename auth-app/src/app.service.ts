import { AmqpConnection, RabbitRPC, RpcResponse } from '@golevelup/nestjs-rabbitmq';
import {  Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { Auth } from './db-schema/auth';
import { MongoError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { BcryptService } from './common/bcrypt';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Auth.name) private authModel:Model<Auth>,
    private bcryptService:BcryptService,
    private amqpConnection:AmqpConnection){}

    /** handles create authentication */
    async createAuth(authData:AuthDTO){
    try{
      console.log("authData==>",authData);
      let {username,password,employeeId} =authData;

      password =  await this.bcryptService.hashPassword(password);

      await this.authModel.updateOne({employeeId},{$set:{username,password}},{new:true,upsert:true}).catch((error:MongoError)=>{
        console.log("error in createAuth=>",error);
        return{
          success:false,
          message:error.errmsg,
          code:"ERR-INTERN"
        }
      });

      return {
        success:true,
        message:"Employee Auth Created Successfully",
        Code:'SUC-DONE'
      }
    }catch(error){
      return{
        success:false,
        message:`Error ${error}`,
        code:"ERR-INTERN"
      }
    }
  }
}
