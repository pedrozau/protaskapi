import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService,PrismaService,UserService],
})
export class TaskModule {}
