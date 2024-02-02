import { ApiProperty } from "@nestjs/swagger";

export class AwardDTO  {
    @ApiProperty({
        description:'The rewardId of the reward',
        default: 1
    })
    rewardId: string;
    @ApiProperty({
         description:'The userId of the user',
         default:1
    })
    userId: string;
}