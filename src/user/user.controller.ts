import { Controller, Post, Body, Get, UseGuards, Request, Res, Session } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user.request.dto';
import { MailRequestDto } from 'src/mail/dto/mail.request.dto';
import { UserVerifyDto } from './dto/user.verify.dto';
import { ApiTags, ApiOperation, ApiBody, ApiResponse} from '@nestjs/swagger'
import { LocalAuthGuard } from 'src/auth/guard/local.guard';
import { UserLoginDto } from './dto/user.login.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { ApiGuard } from 'src/auth/guard/api.guard';


@Controller('user')
@ApiTags('user') 
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(ApiGuard)
    @Get()
    @ApiOperation({ summary: 'Find Every Users Info', description: 'get every users information for test environment' })
    @ApiResponse({ status: 200, description: 'Success' })    
    @ApiResponse({ status: 400, description: 'Request without API KEY' })    
    @ApiResponse({ status: 403, description: 'Invalid API KEY' })    
    async findAll() {
        return await this.userService.findAll();
    }

    @UseGuards(JwtAuthGuard)
	@Get('profile')
    @ApiOperation({ summary: 'Get user info', description: 'get profile information from accessToken inserted in cookies' })
    @ApiResponse({ status: 200, description: 'Success' })
	async getProfile(@Request() req) {
		return req.user;
	}

    @Post()
    @ApiOperation({ summary: 'Add new user', description: 'create new user data in server database' })
    @ApiBody({ type: UserRequestDto })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 408, description: 'Not verified or time expired' })    
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
    @ApiResponse({ status: 401, description: 'Invalid code' })
    @ApiResponse({ status: 408, description: 'Not sent or time expired' })    
    async verify(@Body() body: UserVerifyDto) {
        return await this.userService.verify(body);
    }

    @UseGuards(LocalAuthGuard)
	@Post('login')
    @ApiOperation({ summary: 'Login', description: 'Login with body information including e-mail and password and issue accessToken if request would be validate.' })
    @ApiBody({ type: UserLoginDto })
    @ApiResponse({ status: 201, description: 'Success' })
    @ApiResponse({ status: 401, description: 'Invalid e-mail or password' })    
	async login(@Request() req, @Res({ passthrough: true}) response) {
		const accessToken = req.user.accessToken;
		await response.cookie('Authorization', accessToken);
		return "success";
	}    
}    
