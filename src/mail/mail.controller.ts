import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailRequestDto } from './dto/mail.request.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse} from '@nestjs/swagger';

@Controller('mail')
@ApiTags('mail')
export class MailController {
    constructor(private readonly mailService: MailService){}

    @Post('send')
    @ApiOperation({ summary: 'Send mail', description: 'send the mail with subject and content description to the target address' })
    @ApiBody({ type: MailRequestDto })
    @ApiResponse({ status: 201, description: 'Success' })
    async sendMail(@Body() body: MailRequestDto){
        await this.mailService.sendMail(body);
    }
}
