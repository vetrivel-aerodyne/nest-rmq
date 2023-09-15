
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export class FetchEmployeeDTO {
    @ApiProperty()
    @IsNotEmpty()
    @Min(1)
    @Max(500)
    itemPerPage: number;

    @ApiProperty()
    @IsNotEmpty()
    @Min(1)
    @Max(500)
    pageNo: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    searchText: string
}

