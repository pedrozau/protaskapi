import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './module/task/task.module';
import { UserModule } from './module/user/user.module';
import { RewardModule } from './module/reward/reward.module';
import { ThrottlerModule } from '@nestjs/throttler';


@Module({
  imports: [TaskModule, UserModule, RewardModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
  ]),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
