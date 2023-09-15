import { AmqpConnection, Nack, RabbitRPC, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { AddEmployeeDTO } from './dto/add-employee.dto';
import mongoose, { Model, MongooseError } from 'mongoose';
import { employee } from './db-schema/employee';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { DeleteEmployeeDTO } from './dto/delete-employee.dto';
import { FetchEmployeeDTO } from './dto/fetch-employee.dto';
interface UpdateEmployeeStatus {
  employeeId: string,
  loggedIn: boolean
}
@Injectable()
export class AppService {
  constructor(private amqpConnection: AmqpConnection, @InjectModel(employee.name) private employeeModel: Model<employee>) { }

  /**validate and create employee and request authentication creation  */
  async createEmployee(payload: AddEmployeeDTO): Promise<any> {

    try {
      let { username } = payload;

      let existUserDetail = await this.employeeModel.findOne({ "username": username });
      if (existUserDetail) {
        return {
          success: false,
          message: "User Name Already Exist",
          code: "ERR-EXIST"
        }
      }

      let addResult: any = await new this.employeeModel(payload).save().catch((error: MongooseError) => {
        return {
          success: false,
          message: `Error - ${error.name} : ${error.message}`,
          code: "ERR-INTRN"
        }
      });
      let { _id } = addResult;

      let addRmqRes= await this.amqpConnection.request({ exchange: "auth", routingKey: "create-auth", payload: { username, password: payload.password, employeeId: _id, 'isActive': true }, timeout: 5000 });
      console.log("addRmqRes==>",addRmqRes);
      return {
        success: true,
        message: "Employee Created Successfully",
        code: "SUC-DONE"
      }
    } catch (error) {
      return {
        success: false,
        message: `Error ${error}`,
        code: "ERR-INTRN"
      }
    }
  }

  /**validate and update employee and update authentication if requires  */
  async updateEmployee(payload: UpdateEmployeeDTO): Promise<any> {

    try {
      let { username } = payload;

      let existUserDetail = await this.employeeModel.findOne({ "username": username, _id: { $ne: payload.employeeId } });
      if (existUserDetail) {
        return {
          success: false,
          message: "User Name Already Exist",
          code: "ERR-EXIST"
        }
      }

      let updateResult: any = await this.employeeModel.updateOne({ _id: payload.employeeId }, { $set: payload }).catch((error: MongooseError) => {
        return {
          success: false,
          message: `Error - ${error.name} : ${error.message}`,
          code: "ERR-INTRN"
        }
      });
      let updateRmqRes = await this.amqpConnection.request({ exchange: "auth", routingKey: "create-auth", payload: { username, password: payload.password, employeeId: payload.employeeId, 'isActive': payload.isActive }, timeout: 5000 });
      console.log("updateRmqRes==>", updateRmqRes);
      return {
        success: true,
        message: "Employee Updated Successfully",
        code: "SUC-DONE"
      }
    } catch (error) {
      return {
        success: false,
        message: `Error ${error}`,
        code: "ERR-INTRN"
      }
    }
  }

  /**validate and delete employee and delete authentication  */
  async deleteEmployee(payload: DeleteEmployeeDTO): Promise<any> {

    try {
      let existUserDetail = await this.employeeModel.findById(payload.employeeId);
      if (!existUserDetail) {
        return {
          success: false,
          message: "Employee Not Exist",
          code: "ERR-Deleted"
        }
      }

      let deleteResult: any = await this.employeeModel.deleteOne({ "_id": payload.employeeId }).catch((error: MongooseError) => {
        return {
          success: false,
          message: `Error - ${error.name} : ${error.message}`,
          code: "ERR-INTRN"
        }
      });
      let deleteRmqRes = await this.amqpConnection.request({ exchange: "auth", routingKey: "delete-auth", payload: { employeeId: payload.employeeId }, timeout: 5000 });
      console.log("deleteRmqRes==>", deleteRmqRes);
      return {
        success: true,
        message: "Employee Deleted Successfully",
        code: "SUC-DONE"
      }
    } catch (error) {
      return {
        success: false,
        message: `Error ${error}`,
        code: "ERR-INTRN"
      }
    }
  }

  async getEmployeeList(payload: FetchEmployeeDTO): Promise<any> {
    try {
      let skip = (payload.itemPerPage * payload.pageNo) - payload.itemPerPage;
      let limit = payload.itemPerPage;
      let searchText = payload.searchText;
      let listRef = this.employeeModel.find({
        $or: [
          { employeeName: { $regex: `^${searchText}`, $options: "i" } },
          { username: { $regex: `^${searchText}`, $options: "i" } },
        ]
      }).select({password:0}).skip(skip).limit(limit).lean();
      let countRef = this.employeeModel.find({
        $or: [
          { employeeName: { $regex: `^${searchText}`, $options: "i" } },
          { username: { $regex: `^${searchText}`, $options: "i" } },
        ]
      }).lean().count();
      let [listResult, countResult] = await Promise.all([listRef, countRef]);
      return {
        success: true,
        data: {
          list: listResult,
          total: countResult
        },
        message: "Employee List Fetch Successfully"
      }
    } catch (error) {
      return {
        success: false,
        message: `Error ${error}`,
        code: "ERR-INTRN"
      }
    }
  }

  /**handles employee update status queue  */
  @RabbitSubscribe({
    exchange: "employee",
    routingKey: "update-status",
    queue: 'update-status'
  })
  async UpdateEmployeeStatus(payload: UpdateEmployeeStatus) {
    try {
      let dbResult = await this.employeeModel.updateOne({ _id: payload.employeeId }, { isLoggedIn: payload.loggedIn });
      return new Nack();
    } catch (error) {
      return new Nack(true);
    }
  }
}
