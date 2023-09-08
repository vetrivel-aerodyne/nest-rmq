import mongoose from "mongoose";
export declare class Auth {
    employeeId: mongoose.Schema.Types.ObjectId;
    username: string;
    password: string;
    isNewEmployee: boolean;
    token: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AuthSchema: mongoose.Schema<Auth, mongoose.Model<Auth, any, any, any, mongoose.Document<unknown, any, Auth> & Auth & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, Auth, mongoose.Document<unknown, {}, Auth> & Auth & {
    _id: mongoose.Types.ObjectId;
}>;
