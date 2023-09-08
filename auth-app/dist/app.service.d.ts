import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { AuthDTO } from './dto/create-auth.dto';
import { Model } from 'mongoose';
import { Auth } from './db-schema/auth';
import { BcryptService } from './common/bcrypt';
export declare class AppService {
    private authModel;
    private bcryptService;
    private amqpConnection;
    constructor(authModel: Model<Auth>, bcryptService: BcryptService, amqpConnection: AmqpConnection);
    createAuth(authData: AuthDTO): Promise<{
        success: boolean;
        message: string;
        Code: string;
        code?: undefined;
    } | {
        success: boolean;
        message: string;
        code: string;
        Code?: undefined;
    }>;
}
