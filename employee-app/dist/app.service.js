"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const employee_1 = require("./db-schema/employee");
const mongoose_2 = require("@nestjs/mongoose");
let AppService = class AppService {
    constructor(amqpConnection, employeeModel) {
        this.amqpConnection = amqpConnection;
        this.employeeModel = employeeModel;
    }
    async createEmployee(payload) {
        try {
            let { username } = payload;
            let existUserDetail = await this.employeeModel.findOne({ "username": username });
            if (existUserDetail) {
                return {
                    success: false,
                    message: "User Name Already Exist",
                    code: "ERR-EXIST"
                };
            }
            let addResult = await new this.employeeModel(payload).save().catch((error) => {
                return {
                    success: false,
                    message: `Error - ${error.name} : ${error.message}`,
                    code: "ERR-INTRN"
                };
            });
            let { _id } = addResult;
            await this.amqpConnection.request({ exchange: "auth", routingKey: "create-auth", payload: { username, password: payload.password, employeeId: _id }, timeout: 5000 });
            return {
                success: true,
                message: "Employee Created Successfully",
                code: "SUC-DONE"
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Error ${error}`,
                code: "ERR-INTRN"
            };
        }
    }
    async UpdateEmployeeStatus(payload) {
        try {
            let dbResult = await this.employeeModel.updateOne({ _id: payload.employeeId }, { isLoggedIn: payload.loggedIn });
            return new nestjs_rabbitmq_1.Nack();
        }
        catch (error) {
            return new nestjs_rabbitmq_1.Nack(true);
        }
    }
};
exports.AppService = AppService;
__decorate([
    (0, nestjs_rabbitmq_1.RabbitRPC)({
        exchange: "employee",
        routingKey: "update-status",
        queue: 'update-status'
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppService.prototype, "UpdateEmployeeStatus", null);
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_2.InjectModel)(employee_1.employee.name)),
    __metadata("design:paramtypes", [nestjs_rabbitmq_1.AmqpConnection, mongoose_1.Model])
], AppService);
//# sourceMappingURL=app.service.js.map