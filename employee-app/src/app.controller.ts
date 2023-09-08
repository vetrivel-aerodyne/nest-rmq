import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AddEmployeeDTO } from './dto/add-employee.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('employee')
@Controller('employee')
export class AppController {
  constructor(private readonly appService: AppService,) {}

  @Post()
  createEmployee(@Body() payload:AddEmployeeDTO): Promise<any> {
    return this.appService.createEmployee(payload);
  }
}
