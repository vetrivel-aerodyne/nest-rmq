import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsAlphanumeric, IsArray, IsNotEmpty, IsNumber, IsString, IsStrongPassword, Max, Min } from "class-validator";

export class AuthDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsAlphanumeric()
    username:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsStrongPassword()
    password:string;

    @ApiProperty()
    @IsNotEmpty()
    @IsAlpha()
    employeeId:string;

}