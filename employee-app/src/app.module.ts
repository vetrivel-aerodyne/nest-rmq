import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema, employee } from './db-schema/employee';

@Module({
  imports: [
  MongooseModule.forRoot('mongodb://dev-alldb:devroot@172.20.6.22:27017/vetri?authMechanism=DEFAULT&authSource=admin'),
  MongooseModule.forFeature([{name:employee.name,schema:EmployeeSchema}]),
  RabbitMQModule.forRoot(RabbitMQModule,{
    uri:"amqp://admin:admin@172.20.6.22:5672",
    exchanges:[
      {
        name:"auth",
        type:'topic',
        createExchangeIfNotExists:true
      },
    ],
    connectionInitOptions:{wait:true},
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
