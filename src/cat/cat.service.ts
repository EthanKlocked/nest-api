import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cat } from './schema/cat.schema';
import { Model } from 'mongoose';
import { CatRequestDto } from './dto/cat.request.dto';

@Injectable()
export class CatService {
    constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

    async signUp(body: CatRequestDto) {
        const { email, name, password } = body;
        const isCatExist = await this.catModel.exists({ email });
    
        if (isCatExist) {
            throw new UnauthorizedException('Already exists the cat!');
        }
    
        //const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password;
    
        const cat = await this.catModel.create({
            email,
            name,
            password: hashedPassword,
        });
    
        return cat.readOnlyData;
    }
}
