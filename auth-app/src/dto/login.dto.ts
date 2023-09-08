import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsNotEmpty, IsStrongPassword} from "class-validator";

export class LoginDTO{
    @ApiProperty()
    @IsAlphanumeric()
    username:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password:string;

}