import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user.request.dto';
import { MailRequestDto } from 'src/mail/dto/mail.request.dto';
import { UserVerifyDto } from './dto/user.verify.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async signUp(@Body() body: UserRequestDto) {
        return await this.userService.signUp(body);
    }

    @Post('mail')
    async sendVerification(@Body() body: MailRequestDto) {
        return await this.userService.sendVerification(body);
    }

    @Post('verify')
    async verify(@Body() body: UserVerifyDto) {
        return await this.userService.verify(body);
    }
}    
