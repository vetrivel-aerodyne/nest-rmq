
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class AuthLog{
    @Prop({required:true})
    employeeId:mongoose.Schema.Types.ObjectId;

    @Prop({required:true,enum:['loggedIn','loggedOut']})
    currentStatus:string;

    @Prop({required:false})
    lastLoginDate:Date;

    @Prop({required:false})
    lastLogOutDate:Date;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const AuthLogSchema = SchemaFactory.createForClass(AuthLog);