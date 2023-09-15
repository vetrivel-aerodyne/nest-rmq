import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true })
export class employee {
    @Prop({ required: true })
    employeeName: string;

    @Prop({ required: true })
    age: number;

    @Prop({ required: true })
    gender: string;

    @Prop({ default: [], type: [{ type: String, ref: 'role' }] })
    roles: Array<string>;

    @Prop({ required: true })
    username: string;

    @Prop({ default: false })
    isLoggedIn: boolean;

    @Prop({ default: true })
    isActive: boolean;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const EmployeeSchema = SchemaFactory.createForClass(employee);