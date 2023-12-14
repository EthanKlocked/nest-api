
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class MailRequestDto {
    @IsNotEmpty()
    @IsEmail()  
    @ApiProperty({ description: 'to', example: 'test@test.com' })  
    to: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'subject', example: 'title' })  
    subject: string;

    @IsOptional()
    @IsString()
    @ApiProperty({ description: 'content', example: 'hello! how r u td?' })  
    content: string;
}