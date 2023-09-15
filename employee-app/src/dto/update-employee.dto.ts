
import { ApiProperty } from "@nestjs/swagger";
import { IsAlpha, IsArray, IsBoolean, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsStrongPassword, Max, MaxLength, Min, MinLength } from "class-validator";

export class UpdateEmployeeDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    employeeId: string;

    @ApiProperty()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(30)
    @IsString()
    username: string;

    @ApiProperty()
    @IsOptional()
    @IsStrongPassword()
    @MinLength(8)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsAlpha()
    @MinLength(5)
    @MaxLength(50)
    employeeName: string;

    @ApiProperty()
    @Min(18)
    @Max(150)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    age: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEnum(['Male', 'Female', 'Others'], { message: "gender must be one of the following values: Male/Female/Others" })
    gender: string;

    @ApiProperty()
    @IsBoolean()
    isActive: boolean;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    roles: Array<string>;

}