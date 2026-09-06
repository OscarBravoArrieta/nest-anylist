 import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
 import { User } from './entities/user.entity'
 import { SignupInput } from 'src/auth/dto/inputs'
 import { InjectRepository } from '@nestjs/typeorm'
 import { Repository } from 'typeorm'
 import * as bcrypt from 'bcrypt'
 import { ValidRoles } from 'src/auth/enums/valid-roles.enums'
 
 @Injectable()
 export class UsersService {

     private logger = new Logger('UsersService') //specify the context of the logger

     constructor(

         @InjectRepository(User)
         private readonly usersRepository: Repository<User>
     ) {}

     //--------------------------------------------------------------------------------------------

     async create(signUserInput: SignupInput): Promise<User> {
         try{
             const newUser = this.usersRepository.create({
                 ...signUserInput,
                 password: await bcrypt.hash(signUserInput.password, 10)
             })
             return await this.usersRepository.save(newUser)

         }catch(error){

             this.handleDBErrors(error)

         }

     }

     //--------------------------------------------------------------------------------------------

     async findAll(roles: ValidRoles[]): Promise<User[]> {

         if (roles.length === 0) return this.usersRepository.find()

         return this.usersRepository.createQueryBuilder()
             .andWhere('ARRAY[roles] && ARRAY[:...roles]')
             .setParameter('roles', roles)
             .getMany()
             
     }

     //--------------------------------------------------------------------------------------------

     findOne(id: string): Promise<User> {

         return this.usersRepository.findOneByOrFail({ id })    

     }

     //--------------------------------------------------------------------------------------------

     update(id: string, updateUserInput: any) {

         return `This action updates a #${id} user`

     }

     //--------------------------------------------------------------------------------------------

     async findOneByEmail(email: string): Promise<User> {

         try {

             return await this.usersRepository.findOneByOrFail({ email })

         } catch (error) {
             throw new BadRequestException(`User with email ${email} not found`)
            // this.handleDBErrors({
            //      code: 'error-001',
            //      detail: `User with email ${email} not found`
            // })
         }

     }

     //--------------------------------------------------------------------------------------------
         async findOneById(id: string): Promise<User> {

         try {

             return await this.usersRepository.findOneByOrFail({id})

         } catch (error) {

            throw new BadRequestException(`User with email ${id} not found`)
            
         }

     }

     //--------------------------------------------------------------------------------------------

    // update(id: number, updateUserInput: UpdateUserInput) {
    //   return `This action updates a #${id} user`
    // }

    // remove(id: number) {
    //   return `This action removes a #${id} user`
    // }

     async blockUser(id: string): Promise<User> {

         throw new Error('Method not implemented.')

     }

     //--------------------------------------------------------------------------------------------

     private handleDBErrors(error: any): never {

         if (error.code === '23505') {

             throw new BadRequestException(error.detail.replace('Key ', '') )

         }

         if (error.code === 'error-001') {

             throw new BadRequestException(error.detail.replace('Key ', ''))

         }

         this.logger.error(error)

         throw new InternalServerErrorException('Please check server logs for more details')

     }

     //--------------------------------------------------------------------------------------------
}
