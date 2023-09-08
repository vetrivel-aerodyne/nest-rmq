"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const employee_1 = require("./db-schema/employee");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://dev-alldb:devroot@172.20.6.22:27017/vetri?authMechanism=DEFAULT&authSource=admin'),
            mongoose_1.MongooseModule.forFeature([{ name: employee_1.employee.name, schema: employee_1.EmployeeSchema }]),
            nestjs_rabbitmq_1.RabbitMQModule.forRoot(nestjs_rabbitmq_1.RabbitMQModule, {
                uri: "amqp://admin:admin@172.20.6.22:5672",
                exchanges: [
                    {
                        name: "auth",
                        type: 'topic',
                        createExchangeIfNotExists: true
                    },
                ],
                connectionInitOptions: { wait: true },
            })
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map