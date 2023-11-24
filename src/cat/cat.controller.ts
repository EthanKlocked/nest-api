import { Controller, Post, Body } from '@nestjs/common';
import { CatService } from './cat.service';
import { CatRequestDto } from './dto/cat.request.dto';

@Controller('cat')
export class CatController {
    constructor(private readonly catService: CatService) {}

    @Post()
    async signUp(@Body() body: CatRequestDto) {
        return await this.catService.signUp(body);
    }
}    
