import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO } from 'src/dto/login.dto';
import { LoginService } from './service/login.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class LoginController {
    
    constructor(private loginService:LoginService){}

    /**handles employee login request*/
    @Post('/login')
    async doLogin(@Body() payLoad:LoginDTO){
        return await this.loginService.doLogin(payLoad);
    }
}
