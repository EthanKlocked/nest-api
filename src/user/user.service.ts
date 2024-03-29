import { Inject, Injectable, NotImplementedException, UnauthorizedException, RequestTimeoutException, ConflictException } from '@nestjs/common';
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
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        private readonly mailService: MailService
    ) {}

    async findAll(){
        try{
            const users = await this.userModel.find().exec();
            return users.map((u:User) : User['readOnlyData'] => u.readOnlyData);    
        }catch(e){
            throw new NotImplementedException(e.message);            
        }
    }

    async findOne(option: object = null){
        try{
            const user = await this.userModel.findOne(option);
            return user;
        }catch(e){
            throw new NotImplementedException(e.message);            
        }
    }    

    async findById(id:string){
        try{
            const user = await this.userModel.findById(id);
            return user;
        }catch(e){
            throw new NotImplementedException(e.message);            
        }        
    }

    async signUp(body: UserRequestDto) {
        const { mail, name, password } = body;

        //check time expired 
        const timePass = await this.cacheManager.get(body.mail);
        if(!timePass || timePass != 'passed') throw new RequestTimeoutException('not verified or timed out');

        //check user duplicated
        const isUserExist = await this.userModel.exists({ mail });
        if (isUserExist) throw new ConflictException('The user already exists');

        //join start
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.userModel.create({
            mail,
            name,
            password: hashedPassword,
        });
        return user.readOnlyData;
    }

    async sendVerification(body: MailRequestDto) {
        try{
            const limitSeconds : number = 180000;
            const verifyToken : string = generateRandomNumber(6);
            body.subject = 'verifcation number';
            body.content = verifyToken;
            await this.cacheManager.set(body.mail, verifyToken, 180000);
            this.mailService.sendMail(body);
            return limitSeconds;
        }catch(e){
            throw new NotImplementedException(e.message); 
        }
    }

    async verify(body: UserVerifyDto){        
        const targetCode = await this.cacheManager.get(body.mail);
        if(targetCode === undefined) throw new RequestTimeoutException('not sent or timed out');
        if(body.verificationCode === targetCode){
            await this.cacheManager.set(body.mail, 'passed', 300000); //limited time session for 5mins in joining process 
            return 'Success';
        } 
        else throw new UnauthorizedException('Invalid code');
    }
}
