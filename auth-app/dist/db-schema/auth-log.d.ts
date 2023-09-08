import mongoose from "mongoose";
export declare class AuthLog {
    employeeId: mongoose.Schema.Types.ObjectId;
    currentStatus: string;
    lastLoginDate: Date;
    lastLogOutDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const AuthLogSchema: mongoose.Schema<AuthLog, mongoose.Model<AuthLog, any, any, any, mongoose.Document<unknown, any, AuthLog> & AuthLog & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, AuthLog, mongoose.Document<unknown, {}, AuthLog> & AuthLog & {
    _id: mongoose.Types.ObjectId;
}>;
