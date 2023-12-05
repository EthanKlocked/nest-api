
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserVerifyDto {
  @IsEmail()
  @IsNotEmpty()
  mail: string;

  @IsString()
  @IsNotEmpty()
  verificationCode: string;
}