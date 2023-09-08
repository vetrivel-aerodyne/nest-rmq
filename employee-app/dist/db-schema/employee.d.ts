import mongoose from 'mongoose';
export declare class employee {
    employeeName: string;
    age: number;
    gender: string;
    roles: Array<string>;
    username: string;
    isLoggedIn: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EmployeeSchema: mongoose.Schema<employee, mongoose.Model<employee, any, any, any, mongoose.Document<unknown, any, employee> & employee & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, employee, mongoose.Document<unknown, {}, employee> & employee & {
    _id: mongoose.Types.ObjectId;
}>;
