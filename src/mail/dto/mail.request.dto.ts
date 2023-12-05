
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MailRequestDto {
    @IsNotEmpty()
    @IsEmail()  
    to: string;

    @IsOptional()
    @IsString()
    subject: string;

    @IsOptional()
    @IsString()
    content: string;
}