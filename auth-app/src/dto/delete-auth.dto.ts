import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId,IsNotEmpty} from "class-validator";

export class DeleteAuthDTO{
    @ApiProperty()
    @IsNotEmpty()
    @IsMongoId()
    employeeId:string;

}