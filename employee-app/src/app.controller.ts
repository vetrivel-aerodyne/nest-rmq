import { Body, Controller, Delete, Get, Post, Put, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { AddEmployeeDTO } from './dto/add-employee.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateEmployeeDTO } from './dto/update-employee.dto';
import { FetchEmployeeDTO } from './dto/fetch-employee.dto';
import { DeleteEmployeeDTO } from './dto/delete-employee.dto';
import { Response } from 'express';
@ApiTags('employee')
@Controller('employee')
export class AppController {
  constructor(private readonly appService: AppService,) { }

  @Post()
  async createEmployee(@Body() payload: AddEmployeeDTO,@Res() response:Response): Promise<any> {
    let result = await this.appService.createEmployee(payload);
    if (!result.success) {
      response.status(400).send({
        success: false,
        message: result.message,
        code: result.code
      });
      return;
    } else {
      response.status(200).send({
        success: true,
        message: result.message,
        code: result.code
      });
    }
  }

  @Put()
  async updateEmployee(@Body() payload: UpdateEmployeeDTO, @Res() response: Response): Promise<any> {
    let result = await this.appService.updateEmployee(payload);
    if (!result.success) {
      response.status(400).send({
        success: false,
        message: result.message,
        code: result.code
      });
      return;
    } else {
      response.status(200).send({
        success: true,
        message: result.message,
        code: result.code
      });
    }
  }

  @Delete()
  async deleteEmployee(@Query() payload: DeleteEmployeeDTO, @Res() response: Response): Promise<any> {
    let result = await this.appService.deleteEmployee(payload);
    if (!result.success) {
      response.status(400).send({
        success: false,
        message: result.message,
        code: result.code
      });
      return;
    } else {
      response.status(200).send({
        success: true,
        message: result.message,
        code: result.code
      });
    }
  }

  @Post("/list")
  fetchEmployeeList(@Body() payload: FetchEmployeeDTO): Promise<any> {
    return this.appService.getEmployeeList(payload);
  }
}
