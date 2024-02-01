import { Module } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardController } from './reward.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [RewardController],
  providers: [RewardService,PrismaService,UserService],
})
export class RewardModule {}
