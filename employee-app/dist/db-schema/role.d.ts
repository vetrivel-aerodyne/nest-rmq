import mongoose from 'mongoose';
export declare class role {
    roleName: string;
    permissions: Array<string>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const RoleSchema: mongoose.Schema<role, mongoose.Model<role, any, any, any, mongoose.Document<unknown, any, role> & role & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, role, mongoose.Document<unknown, {}, role> & role & {
    _id: mongoose.Types.ObjectId;
}>;
