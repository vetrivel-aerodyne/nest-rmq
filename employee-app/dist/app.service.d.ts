import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq';
import { AddEmployeeDTO } from './dto/add-employee.dto';
import { Model } from 'mongoose';
import { employee } from './db-schema/employee';
interface UpdateEmployeeStatus {
    employeeId: string;
    loggedIn: boolean;
}
export declare class AppService {
    private amqpConnection;
    private employeeModel;
    constructor(amqpConnection: AmqpConnection, employeeModel: Model<employee>);
    createEmployee(payload: AddEmployeeDTO): Promise<any>;
    UpdateEmployeeStatus(payload: UpdateEmployeeStatus): Promise<Nack>;
}
export {};
