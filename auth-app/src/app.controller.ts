import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import { AuthDTO } from './dto/create-auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** handles create auth queue in controller level*/
  @RabbitRPC({
    routingKey:'create-auth',
    exchange:'auth',
    queue:"create-auth"
  })
  async handleCreateAuth(details:AuthDTO){
      console.log("processNewAuth details==>",details);
     let result= await this.appService.createAuth(details);
     console.log("result in createAuth==>",result);
      return result;
  }
}
