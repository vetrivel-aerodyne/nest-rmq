import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsBoolean, IsMongoId, IsNotEmpty, IsStrongPassword} from "class-validator";

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
    @IsBoolean()
    isActive:boolean;

    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    employeeId:string;

}