 import { InputType, Field, Float } from '@nestjs/graphql';
 import { IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';

@InputType()
export class CreateItemInput {
     @Field(() => String)
     @IsNotEmpty({ message: 'Name is required' })
     @IsString({ message: 'Name must be a string' })
     name!: string

     @Field(() => Float)
     @IsNotEmpty({ message: 'Quantity is required' })
     @IsPositive({ message: 'Quantity must be a positive number' })
     quantity!: number

     @Field(() => String, { nullable: true })
     @IsString({ message: 'Quantity unit must be a string' })
     @IsOptional()
     quantityUnit?: string

}
