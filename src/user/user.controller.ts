import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDto } from './dto/user.request.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async signUp(@Body() body: UserRequestDto) {
        return await this.userService.signUp(body);
    }

    @Get()
    async testCache() {
        return await this.userService.testCache();
    }
}    
