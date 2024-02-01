import { Body, Controller, Post } from '@nestjs/common';
import { RewardService } from './reward.service';
import { RewardDTO } from '../DTO/reward.dto';

@Controller('reward')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}
   
 @Post('create')
 async create(@Body() data:RewardDTO) {
   return await this.rewardService.createReward(data)
  }
  
  @Post('award')
  async  getReward(@Body('rewardId') rewardId: string, @Body('userId') userId: string) {
     return await this.rewardService.getReward(rewardId, userId)
  }
  
}
