import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user.request.dto';
import { MailRequestDto } from 'src/mail/dto/mail.request.dto';
import { UserVerifyDto } from './dto/user.verify.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse} from '@nestjs/swagger'

@Controller('user')
@ApiTags('user') 
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    @ApiOperation({ summary: 'Find Every Users Info', description: 'get every users information for test environment' })
    @ApiResponse({ status: 201, description: 'Success' })    
    async findAll() {
        return await this.userService.findAll();
    }

    @Post()
    @ApiOperation({ summary: 'Add new user', description: 'create new user data in server database' })
    @ApiBody({ type: UserRequestDto })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 409, description: 'The user already exists' })
    async signUp(@Body() body: UserRequestDto) {
        return await this.userService.signUp(body);
    }

    @Post('mail')
    @ApiOperation({ summary: 'Send verification mail', description: 'send a verifcation mail which would be 6digits for <mail> value as the target' })
    @ApiBody({ type: MailRequestDto })
    @ApiResponse({ status: 201, description: 'Success' })
    async sendVerification(@Body() body: MailRequestDto) {
        return await this.userService.sendVerification(body);
    }

    @Post('verify')
    @ApiOperation({ summary: 'Verify digit code', description: 'Check if the verificationCode value is same with the code server sent and cached for limited time' })
    @ApiBody({ type: UserVerifyDto })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 401, description: 'Invalidate code' })
    @ApiResponse({ status: 408, description: 'Not Submitted or Time Expired' })    
    async verify(@Body() body: UserVerifyDto) {
        return await this.userService.verify(body);
    }
}    
