
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RewardDTO } from '../DTO/reward.dto';
import { UserService } from '../user/user.service';


@Injectable()
export class RewardService {

    constructor(private prisma: PrismaService, private user: UserService) {}

     
     async createReward(d:RewardDTO) {
          
           try{
            return await this.prisma.reward.create({
              data: {
                 award: d.award,
                 points:Number(d.points),
                 userId: d.userId
              }
           })
          }catch(e) {
             throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
          }
     }

     async getReward(rewardId: string, userId: string) {

           try{
            const userData =  await this.user.getUserOne(userId) 
            const reward = await this.prisma.reward.findFirst({
              where: {
                  id: rewardId,
                userId: userData.id
              }
            })
  
            let  award_system =  reward.points  
  
            let user_award = userData.points
  
            if(award_system > user_award) {
               return {
                   message: "User does not have enough points to claim reward",
                   newPoints: user_award
               }
            }else {
              let award_result = user_award - award_system
            
               await this.user.doneTask(award_result, userData.id)
  
              return {
                  message: "Reward claimed successfully",
                  newPoints: award_result
              }
              
            }
  
           }catch(e) {
             throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
           }
          
          

     }


     async getById(id: string) {
      try{
           return await this.prisma.reward.findFirst({
             where: {
               id: id,
             },
           });
         }catch(e) {
            throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
         }
     }


     async getByUser(userId: string) {
        
          try{

            const  userid = await this.prisma.user.findFirst({
                where: {
                     id: userId
                }
            })

            return await this.prisma.reward.findMany({
               where: {
                userId: userid.id
               }
            })

          }catch(e) {
             throw new HttpException(e.message,HttpStatus.BAD_REQUEST)
          }

     }
     

}
