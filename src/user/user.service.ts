import { Inject, Injectable, NotImplementedException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { UserRequestDto } from './dto/user.request.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { generateRandomNumber } from 'src/library';
import { MailService } from 'src/mail/mail.service';
import { MailRequestDto } from 'src/mail/dto/mail.request.dto';
import { UserVerifyDto } from './dto/user.verify.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly mailService: MailService
    ) {}

    async sendVerification(body: MailRequestDto) {
        try{
            const limitSeconds : number = 180000;
            const verifyToken : string = generateRandomNumber(6);
            body.subject = 'verifcation number';
            body.content = verifyToken;
            await this.cacheManager.set(body.to, verifyToken, 180000);
            this.mailService.sendMail(body);
            return limitSeconds;
        }catch(e){
            throw new NotImplementedException(e.message); 
        }

    }

    async verify(body: UserVerifyDto){
        try{
            const targetCode = await this.cacheManager.get(body.mail);
            if(body.verificationCode == targetCode) return true;
            else throw new UnauthorizedException('invalidate code');
        }catch(e){
            throw new NotImplementedException(e.message);
        }
    }

    async signUp(body: UserRequestDto) {
        try{
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
        }catch(e){
            throw new NotImplementedException(e.message);            
        }
    }
}
