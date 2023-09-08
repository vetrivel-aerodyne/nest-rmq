import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './db-schema/auth';
import { BcryptService } from './common/bcrypt';
import { JWTService } from './common/jwt';
import { LoginController } from './login/login.controller';
import { AuthLog, AuthLogSchema } from './db-schema/auth-log';
import { LoginService } from './login/service/login.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://dev-alldb:devroot@172.20.6.22:27017/vetri?authMechanism=DEFAULT&authSource=admin'),
    MongooseModule.forFeature([{name:Auth.name,schema:AuthSchema},{name:AuthLog.name,schema:AuthLogSchema}]),
    RabbitMQModule.forRoot(RabbitMQModule,{
    uri:"amqp://admin:admin@172.20.6.22:5672/",
    exchanges:[
      {
        name:"employee",
        type:'topic',
        createExchangeIfNotExists:true
      }
    ],
    enableControllerDiscovery:true,
    connectionInitOptions:{wait:false} 
  })],
  controllers: [AppController, LoginController],
  providers: [AppService,AppController,BcryptService,JWTService,LoginService],
})
export class AppModule {}
