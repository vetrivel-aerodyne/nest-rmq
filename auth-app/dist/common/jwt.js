"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const common_1 = require("@nestjs/common");
var jwt = require('jsonwebtoken');
const SecretKey = "RU1QTE9ZRUVTRUNSRVRLRVk=";
let JWTService = class JWTService {
    generateToken(data) {
        return jwt.sign(data, SecretKey);
    }
    verify(token) {
        try {
            return jwt.verify(token, SecretKey);
        }
        catch (error) {
            console.log("verify error=>", error);
            return false;
        }
    }
};
exports.JWTService = JWTService;
exports.JWTService = JWTService = __decorate([
    (0, common_1.Injectable)()
], JWTService);
//# sourceMappingURL=jwt.js.map