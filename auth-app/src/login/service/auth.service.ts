import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import { BcryptService } from 'src/common/bcrypt';
import { JWTService } from 'src/common/jwt';
import { Auth } from 'src/db-schema/auth';
import { AuthLog } from 'src/db-schema/auth-log';
import { LoginDTO } from 'src/dto/login.dto';
@Injectable()
export class AuthService {

    constructor(
        @InjectModel(Auth.name) private authModel:Model<Auth>,
        @InjectModel(AuthLog.name) private authLogModel:Model<AuthLog>,
        private bcryptService:BcryptService,
        private jwtService:JWTService,
        private amqpConnection:AmqpConnection){}

    //** Validates employee credentials,updates the status in employee collection and provide access token */
    async doLogin(loginData:LoginDTO){

        try{
            let {username,password}=loginData;

            let authDetail = await this.authModel.findOne({username:username});
            if(!authDetail){
                return {
                    success:false,
                    message:"Invalid User Name",
                    code:"ERR-NOT-EXIST"
                }
            }

            let isPasswordMatch = await this.bcryptService.comparePassword(password,authDetail.password);
            if(!isPasswordMatch){
                return {
                    success:false,
                    message:"Invalid Password",
                    code:"ERR-PASS"
                }
            }

            if(!authDetail.isActive){
                return {
                    success:false,
                    message:"User in In-Active State.contact Admin",
                    code:"ERR-InActive"
                }
            }

            let tokenPayload={employeeId:authDetail._id};
            let jwtToken = this.jwtService.generateToken(tokenPayload);

            let authLogRef= this.authLogModel.updateOne({employeeId:authDetail._id},{employeeId:authDetail.employeeId,currentStatus:'loggedIn',lastLoginDate:new Date()},{upsert:true});
            let publishRef= this.amqpConnection.publish("employee","update-status",{'employeeId':authDetail.employeeId,'loggedIn':true});
            forkJoin({authLog:authLogRef,publish:publishRef}).subscribe((result:any)=>{console.log("result in forkJoin==>",result);});

            
            return {
                success:true,
                message:"User LoggedIn Successfully",
                data:{
                    token:jwtToken
                },
                code:"SUC-DONE"
            }
        }catch(error){
            return {
                success:false,
                message:`Error: ${error}`,
                code:"ERR-INTRN"
            }
        }
    }
}
