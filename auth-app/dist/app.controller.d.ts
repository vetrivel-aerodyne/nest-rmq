import { AppService } from './app.service';
import { AuthDTO } from './dto/create-auth.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    handleCreateAuth(details: AuthDTO): Promise<{
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
