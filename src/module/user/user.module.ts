import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from './constants';

@Module({
  imports:[
    JwtModule.register({
      global: true,
      secret: jwtContants.secret,
      signOptions: { expiresIn: '1d' },
    })
  ],
  controllers: [UserController],
  providers: [UserService,PrismaService],
})
export class UserModule {}
