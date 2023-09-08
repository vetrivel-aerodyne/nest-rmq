import mongoose from "mongoose";
export declare class EmployeeDTO {
    employeeId: mongoose.Types.ObjectId;
    username: string;
    password: string;
    employeeName: string;
    age: number;
    gender: string;
    roles: Array<string>;
}
