import { Injectable, NotImplementedException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";
import { MailRequestDto } from './dto/mail.request.dto';

@Injectable()
export class MailService {
    private readonly transporter;

    constructor(private readonly configService: ConfigService){
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user : this.configService.get<string>("MAIL_ID"),
                pass : this.configService.get<string>("MAIL_PASSWORD"),
            }
        });
    }

    async sendMail(body: MailRequestDto) {
        try{
            await this.transporter.sendMail({
                from : 'nestTester@test.com',
                to : body.mail,
                subject : body.subject,
                text : body.content
            });
            return 'Success';
        }catch(e){
            throw new NotImplementedException(e.message); 
        }
    }
}
