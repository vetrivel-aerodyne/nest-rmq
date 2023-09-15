
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteEmployeeDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    employeeId: string;
}