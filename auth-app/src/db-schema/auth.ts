import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({ timestamps: true })
export class Auth{
    @Prop({required:true})
    employeeId:mongoose.Schema.Types.ObjectId;
    
    @Prop({required:true})
    username:string;

    @Prop({required:true})
    password:string;

    @Prop({required:true,default:true})
    isNewEmployee:boolean;
    
    @Prop()
    token:string;

    @Prop({required:true,default:true})
    isActive:boolean;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const AuthSchema = SchemaFactory.createForClass(Auth);