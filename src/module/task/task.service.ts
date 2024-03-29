import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskDTO } from '../DTO/task.dto';
import { UserService } from '../user/user.service';
import { UserDTO } from '../DTO/user.dto';


@Injectable()
export class TaskService {
  
    constructor(private db:PrismaService, private user: UserService) {}



    async createTask({task,level,done,userId}:TaskDTO) {

            
           const levl = Number(level)
         
          try{
            return await this.db.task.create({
                data: {
                task,
                level: levl,
                done:false,
                userId
                }
             })

          }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
          }

    }


    async getAllTask(userId: string) {
       

         try {
          
            const checkId = await this.db.user.findFirst({
                 where: {
                     id: userId
                 }
            })


            if(!checkId) throw new HttpException('id is invalid!',HttpStatus.BAD_REQUEST);
                
          
           return  await this.db.task.findMany({
                  where:{
                     userId: checkId.id
                  }
            })


         }catch(e) {

             throw new HttpException(e.message,HttpStatus.BAD_REQUEST)
         }


    }



    async doneTAsk(done: boolean, taskId: string,level:number,userId: string) {
      
         try{
            let userPoints = 0;
            if(done) {
            /**
             * level 0 facil 20
             * level 1 medio  30 
             * level 2 dificil 50 
             */
      
              const userData =  await this.user.getUserOne(userId)
            
      
              
              
              if(level == 0) {
                 userPoints = userData.points + 20
              }else if(level == 1) {
                  userPoints = userData.points + 30 
              }else if(level == 2) {
                   userPoints = userData.points + 50 
              }
              
              this.user.doneTask(userPoints, userId)
      
              
              await this.db.task.update({
                  where: {
                      id: taskId
                  },
                  data: {
                      done: true
                  }
              })
      
            }
         }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
         }


    }

 
   async deleteTask(taskId: string)  {
    try{

        return await this.db.task.delete({
            where: {
                id: taskId
            }
        })

    }catch(e) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
    
   }

   async getbyid(taskId: string) {
     try{
         return await this.db.task.findFirst({
             where: {
                 id: taskId
             }
         })
      }catch(e) {
         throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
      }
   }


}
