 import { PassportModule } from '@nestjs/passport'
 import { ConfigModule, ConfigService } from '@nestjs/config'
 import { Module } from '@nestjs/common'
 import { JwtModule } from '@nestjs/jwt'
 import { AuthService } from './auth.service'
 import { AuthResolver } from './auth.resolver'
 import { UsersModule } from 'src/users/users.module'
 import { JwtStrategy } from './strategies/jwt.strategy'

 @Module({

     providers: [AuthResolver, AuthService, JwtStrategy],
     exports: [ JwtStrategy, PassportModule, JwtModule ],
     imports: [

         ConfigModule,
         PassportModule.register({ defaultStrategy: 'jwt' }),
         JwtModule.registerAsync({
             imports: [ConfigModule],
             inject: [ConfigService],

             useFactory: async (configService: ConfigService) => ({
             secret: configService.get<string>('JWT_SECRET'),
             signOptions: { 
                 expiresIn: '4h'// configService.get<string>('JWT_EXPIRATION') as string
             }
                 
             })
         }),
         UsersModule,
         
     ]
 })
 export class AuthModule {}
