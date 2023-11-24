import { Controller, Get } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";

@Controller('')
export class AppController {
    constructor(private readonly configService: ConfigService) {}

    @Get()
    home(){
        const name = this.configService.get<string>("APP_NAME");
        return `Welcome to my ${name}!`
    }
}
