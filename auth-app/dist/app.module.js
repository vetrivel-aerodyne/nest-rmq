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
const app_service_1 = require("./app.service");
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const mongoose_1 = require("@nestjs/mongoose");
const auth_1 = require("./db-schema/auth");
const bcrypt_1 = require("./common/bcrypt");
const jwt_1 = require("./common/jwt");
const login_controller_1 = require("./login/login.controller");
const auth_log_1 = require("./db-schema/auth-log");
const login_service_1 = require("./login/service/login.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot('mongodb://dev-alldb:devroot@172.20.6.22:27017/vetri?authMechanism=DEFAULT&authSource=admin'),
            mongoose_1.MongooseModule.forFeature([{ name: auth_1.Auth.name, schema: auth_1.AuthSchema }, { name: auth_log_1.AuthLog.name, schema: auth_log_1.AuthLogSchema }]),
            nestjs_rabbitmq_1.RabbitMQModule.forRoot(nestjs_rabbitmq_1.RabbitMQModule, {
                uri: "amqp://admin:admin@172.20.6.22:5672/",
                exchanges: [
                    {
                        name: "employee",
                        type: 'topic',
                        createExchangeIfNotExists: true
                    }
                ],
                enableControllerDiscovery: true,
                connectionInitOptions: { wait: false }
            })
        ],
        controllers: [app_controller_1.AppController, login_controller_1.LoginController],
        providers: [app_service_1.AppService, app_controller_1.AppController, bcrypt_1.BcryptService, jwt_1.JWTService, login_service_1.LoginService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map