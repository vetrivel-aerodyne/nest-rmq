import { AmqpConnection, RabbitRPC, RpcResponse } from '@golevelup/nestjs-rabbitmq';
import {  Injectable } from '@nestjs/common';
import { AuthDTO } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { Auth } from './db-schema/auth';
import { MongoError } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { BcryptService } from './common/bcrypt';
import { DeleteAuthDTO } from './dto/delete-auth.dto';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Auth.name) private authModel:Model<Auth>,
    private bcryptService:BcryptService,
    private amqpConnection:AmqpConnection){}

    /** handles create and update authentication */
    async createAuth(authData:AuthDTO){
    try{
      let {username,password,isActive,employeeId} =authData;

      password =  await this.bcryptService.hashPassword(password);

      await this.authModel.updateOne({employeeId},{$set:{username,password,isActive}},{new:true,upsert:true}).catch((error:MongoError)=>{
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

  /** handles delete auth queue*/
  @RabbitRPC({
    routingKey:'delete-auth',
    exchange:'auth',
    queue:"delete-auth"
  })
  async handleDeleteAuth(details:DeleteAuthDTO){
     let result= await this.authModel.deleteOne({employeeId:details.employeeId}).catch((error:MongoError)=>{
      return{
        success:false,
        message:error.errmsg,
        code:"ERR-INTERN"
      }
    });
     return result;
  }
}
