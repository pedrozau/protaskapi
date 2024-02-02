import { ApiProperty } from "@nestjs/swagger";


export class RewardDTO {

      @ApiProperty({
            description:'The award of the reward',
            default: 'Award'
      })
      award: string;
      @ApiProperty({
            description:'The points of the reward',
            default: 100
      })
      points: number;
      @ApiProperty({
            description:'userId of the reward',
            default: '1'
      })
      userId: string;
}