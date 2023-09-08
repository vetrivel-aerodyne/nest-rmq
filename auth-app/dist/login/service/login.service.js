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
exports.LoginService = void 0;
const nestjs_rabbitmq_1 = require("@golevelup/nestjs-rabbitmq");
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rxjs_1 = require("rxjs");
const bcrypt_1 = require("../../common/bcrypt");
const jwt_1 = require("../../common/jwt");
const auth_1 = require("../../db-schema/auth");
const auth_log_1 = require("../../db-schema/auth-log");
let LoginService = class LoginService {
    constructor(authModel, authLogModel, bcryptService, jwtService, amqpConnection) {
        this.authModel = authModel;
        this.authLogModel = authLogModel;
        this.bcryptService = bcryptService;
        this.jwtService = jwtService;
        this.amqpConnection = amqpConnection;
    }
    async doLogin(loginData) {
        try {
            let { username, password } = loginData;
            let authDetail = await this.authModel.findOne({ username: username });
            console.log("authDetail==>", authDetail);
            if (!authDetail) {
                return {
                    success: false,
                    message: "Invalid User Name",
                    code: "ERR-NOT-EXIST"
                };
            }
            let isPasswordMatch = await this.bcryptService.comparePassword(password, authDetail.password);
            if (!isPasswordMatch) {
                return {
                    success: false,
                    message: "Invalid Password",
                    code: "ERR-PASS"
                };
            }
            let tokenPayload = { employeeId: authDetail._id };
            let jwtToken = this.jwtService.generateToken(tokenPayload);
            let authLogRef = this.authLogModel.updateOne({ employeeId: authDetail._id }, { employeeId: authDetail.employeeId, currentStatus: 'loggedIn', lastLoginDate: new Date() }, { upsert: true });
            let publishRef = this.amqpConnection.publish("employee", "update-status", { 'employeeId': authDetail.employeeId, 'loggedIn': true });
            (0, rxjs_1.forkJoin)({ authLog: authLogRef, publish: publishRef }).subscribe((result) => { console.log("result in forkJoin==>", result); });
            return {
                success: true,
                message: "User LoggedIn Successfully",
                data: {
                    token: jwtToken
                },
                code: "SUC-DONE"
            };
        }
        catch (error) {
            return {
                success: false,
                message: `Error: ${error}`,
                code: "ERR-INTRN"
            };
        }
    }
};
exports.LoginService = LoginService;
exports.LoginService = LoginService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(auth_1.Auth.name)),
    __param(1, (0, mongoose_1.InjectModel)(auth_log_1.AuthLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        bcrypt_1.BcryptService,
        jwt_1.JWTService,
        nestjs_rabbitmq_1.AmqpConnection])
], LoginService);
//# sourceMappingURL=login.service.js.map