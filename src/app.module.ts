import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './module/task/task.module';
import { UserModule } from './module/user/user.module';
import { RewardModule } from './module/reward/reward.module';


@Module({
  imports: [TaskModule, UserModule, RewardModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
