/* eslint-disable prettier/prettier */
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUsuarioDto {
    @IsEmail()
    email: string;
    
    @MinLength(6)
    @IsString()
    password: string;
}
