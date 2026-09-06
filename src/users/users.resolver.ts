 import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
 import { UsersService } from './users.service';
 import { User } from './entities/user.entity';
 import { CreateUserInput } from './dto/create-user.input';
 import { UpdateUserInput } from './dto/update-user.input';
 import { ValidRolesArgs } from './dto/args/roles.arg';
 import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
 import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
 import { CurrentUser } from '../auth/decorators/curren-user.decorator';
 import { ValidRoles } from 'src/auth/enums/valid-roles.enums';

 @Resolver(() => User)
 @UseGuards(JwtAuthGuard)
 export class UsersResolver {
     constructor(private readonly usersService: UsersService) {}
     @Query(() => [User], { name: 'users' })
     findAll(
             @Args() validRoles: ValidRolesArgs, 
             @CurrentUser([ValidRoles.admin]) currentUser: User
         ): Promise<User[]> {

         console.log(currentUser)
         

         return this.usersService.findAll(validRoles.roles);

     }

     //--------------------------------------------------------------------------------------------

     @Query(() => User, { name: 'user' })
     findOne(
         @Args(
             'id', { type: () => ID }, ParseUUIDPipe) id: string, 
             @CurrentUser([ValidRoles.admin, ValidRoles.superUser]) currentUser: User
         ): Promise<User> {

         console.log(currentUser)

         return this.usersService.findOneById(id);

     }

     //--------------------------------------------------------------------------------------------

    //method updateUser and removeUser are commented out because they are not needed for the current implementation. They can be implemented in the future if needed.

    // @Mutation(() => User)
    // updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    //   return this.usersService.update(updateUserInput.id, updateUserInput);
    // }

    // @Mutation(() => User)
    // removeUser(@Args('id', { type: () => Int }) id: number) {
    //   return this.usersService.remove(id);
    // }

     @Mutation(() => User)

     blockUser(@Args('id', { type: () => ID }) id: string) {

         return this.usersService.blockUser(id);
         
     }

     //--------------------------------------------------------------------------------------------
}
