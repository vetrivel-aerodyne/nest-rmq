import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })

export class role {
    @Prop({ required: true })
    roleName: string;

    @Prop({ required: true })
    permissions: Array<string>;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const RoleSchema = SchemaFactory.createForClass(role);