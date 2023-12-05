import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailService {
    private transporter;

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

    async sendMail(to: string, subject: string, content: string) {
        try{
            await this.transporter.sendMail({
                from : 'test@test.com',
                to : to,
                subject : subject,
                text : content
            });
            console.log('succeed to send mail');
        }catch(e){
            console.log('error occured in sending mail service',e);
        }
    }
}
