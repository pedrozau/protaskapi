import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardDTO } from '../DTO/reward.dto';
import { AuthGuard } from '../user/auth.guard';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
   
 @Post('create')
 @UseGuards(AuthGuard)
 async create(@Body() data:RewardDTO) {
   return await this.rewardService.createReward(data)
  }
  
  @Post('award')
  @UseGuards(AuthGuard)
  async  getReward(@Body('rewardId') rewardId: string, @Body('userId') userId: string) {
     return await this.rewardService.getReward(rewardId, userId)
  }
  
}
