import { LoginDTO } from 'src/dto/login.dto';
import { LoginService } from './service/login.service';
export declare class LoginController {
    private loginService;
    constructor(loginService: LoginService);
    doLogin(payLoad: LoginDTO): Promise<{
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
