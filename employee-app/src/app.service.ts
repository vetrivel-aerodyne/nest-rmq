import { AmqpConnection, Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { AddEmployeeDTO } from './dto/add-employee.dto';
import mongoose, { Model, MongooseError } from 'mongoose';
import { employee } from './db-schema/employee';
import { InjectModel } from '@nestjs/mongoose';
interface UpdateEmployeeStatus{
  employeeId:string,
  loggedIn:boolean
}
@Injectable()
export class AppService {
  constructor(private amqpConnection:AmqpConnection,@InjectModel(employee.name) private employeeModel:Model<employee>){}

  /**validate and create employee and request authentication creation  */
  async createEmployee(payload:AddEmployeeDTO): Promise<any> {

    try{
      let {username}=payload;

    let existUserDetail = await this.employeeModel.findOne({"username":username});
    if(existUserDetail){
        return{
          success:false,
          message:"User Name Already Exist",
          code:"ERR-EXIST"
        }
    }

    let addResult:any = await new this.employeeModel(payload).save().catch((error:MongooseError)=>{
      return{
        success:false,
        message:`Error - ${error.name} : ${error.message}`,
        code:"ERR-INTRN"
      }
    });
    let {_id} = addResult;

    await this.amqpConnection.request({exchange:"auth",routingKey:"create-auth",payload:{username,password:payload.password,employeeId:_id},timeout:5000});

    return{
          success:true,
          message:"Employee Created Successfully",
          code:"SUC-DONE"
        }
    }catch(error){
      return{
        success:false,
        message:`Error ${error}`,
        code:"ERR-INTRN"
      }
    }
  }

  /**handles employee update status queue  */
  @RabbitRPC({
    exchange:"employee",
    routingKey:"update-status",
    queue:'update-status'
  })
  async UpdateEmployeeStatus(payload:UpdateEmployeeStatus){
   try{
    let dbResult =await this.employeeModel.updateOne({_id:payload.employeeId},{isLoggedIn:payload.loggedIn});
    return new Nack();
   }catch(error){
    return new Nack(true);
   }
  }
}
