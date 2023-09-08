import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Model } from 'mongoose';
import { BcryptService } from 'src/common/bcrypt';
import { JWTService } from 'src/common/jwt';
import { Auth } from 'src/db-schema/auth';
import { AuthLog } from 'src/db-schema/auth-log';
import { LoginDTO } from 'src/dto/login.dto';
export declare class LoginService {
    private authModel;
    private authLogModel;
    private bcryptService;
    private jwtService;
    private amqpConnection;
    constructor(authModel: Model<Auth>, authLogModel: Model<AuthLog>, bcryptService: BcryptService, jwtService: JWTService, amqpConnection: AmqpConnection);
    doLogin(loginData: LoginDTO): Promise<{
        success: boolean;
        message: string;
        code: string;
        data?: undefined;
    } | {
        success: boolean;
        message: string;
        data: {
            token: any;
        };
        code: string;
    }>;
}
