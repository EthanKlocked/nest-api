import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailRequestDto } from './dto/mail.request.dto';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService){}

    @Post('send')
    async sendMail(@Body() body: MailRequestDto){
        await this.mailService.sendMail(body);
    }
}
