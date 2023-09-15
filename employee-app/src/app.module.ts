import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeSchema, employee } from './db-schema/employee';

const MongoDB_URI='mongodb://dev-alldb:devroot@172.20.6.22:27017/vetri?authMechanism=DEFAULT&authSource=admin';
const RMQ_Config={
  uri:"amqp://admin:admin@172.20.6.22:5672",
  exchanges:[
    {
      name:"auth",
      type:'topic',
      createExchangeIfNotExists:true
    },
  ],
  connectionInitOptions:{wait:true},
};

@Module({
  imports: [
  MongooseModule.forRoot(MongoDB_URI),
  MongooseModule.forFeature([{name:employee.name,schema:EmployeeSchema}]),
  RabbitMQModule.forRoot(RabbitMQModule,RMQ_Config)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
