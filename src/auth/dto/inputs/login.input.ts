 import { IsEmail, IsNotEmpty, MinLength } from "class-validator"
 import { Field, InputType } from "@nestjs/graphql"

 @InputType() 
 export class LoginInput {

     @Field(() => String)
     @IsEmail({}, {message: "Invalid email"})
     email!: string

     @Field(() => String)
     @IsNotEmpty({message: "Password is required"})
     @MinLength(6, {message: "Password must be at least 6 characters long"})
     password!: string
     
 }