 import { IsUUID } from 'class-validator';
import { CreateItemInput } from './create-item.input';
 import { InputType, Field, PartialType, ID} from '@nestjs/graphql';

 @InputType()
 export class UpdateItemInput extends PartialType(CreateItemInput) {
     @Field(() => ID)
     @IsUUID('4', { message: 'ID must be a valid UUID' })
     id!: string;
}
