import { AppService } from './app.service';
import { AddEmployeeDTO } from './dto/add-employee.dto';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    createEmployee(payload: AddEmployeeDTO): Promise<any>;
}
