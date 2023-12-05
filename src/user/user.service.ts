import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserRequestDto } from './dto/user.request.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) {}

    async testCache(){
        await this.cacheManager.set('cached_item', { key: 32 });
        const cachedItem = await this.cacheManager.get('cached_item');
        console.log(cachedItem);
    }

    async signUp(body: UserRequestDto) {
        const { email, name, password } = body;
        const isUserExist = await this.userModel.exists({ email });
    
        if (isUserExist) {
            throw new UnauthorizedException('Already exists the user!');
        }
    
        //const hashedPassword = await bcrypt.hash(password, 10);
        const hashedPassword = password;
    
        const user = await this.userModel.create({
            email,
            name,
            password: hashedPassword,
        });
    
        return user.readOnlyData;
    }
}
