import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { AuthService } from './service/auth.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class LoginController {
    
    constructor(private AuthService:AuthService){}

    /**handles employee login request*/
    @Post('/login')
    async doLogin(@Body() payLoad:LoginDTO){
        return await this.AuthService.doLogin(payLoad);
    }
}
