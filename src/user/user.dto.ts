import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Transform } from 'class-transformer';

export class UserDto {
    @IsNotEmpty({ message: 'Name is required' })
    @Transform(( user ) => user.value.trim())
    username: string;
    
    @IsEmail({},{ message: 'Email is not valid' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

}