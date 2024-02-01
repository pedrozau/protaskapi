import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDTO } from '../DTO/user.dto';
import { hash } from 'bcrypt';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createAccount({name,email,password}: UserDTO) {
        
      const  emailExist  =  await this.prisma.user.findFirst({
        where: {
            email
        }
      })

      if(emailExist) {
        throw new HttpException('user already existe',HttpStatus.BAD_REQUEST)  
      }

      const  passwordHash = await hash(password,13)


      const createAccount = await this.prisma.user.create({
         data: {
          name,
          email,
          password:passwordHash,
         }
      })


      return createAccount;
   

  }

  async updateAccount({password,name,email,avatarUrl,points}:UserDTO,userId:string) {


    const idExiste =  await this.prisma.user.findFirst({
       where: {
        id: userId
       }
    })

   if(!idExiste) {
      throw new HttpException('id is invalid!',HttpStatus.BAD_REQUEST)
   }

   if(!password) {
       
     await this.prisma.user.update({
      where: {
         id: userId
      },
      data:{
         password: idExiste.password,
         name: idExiste.name,
         email: idExiste.email,
         points: idExiste.points,
         avatarUrl: idExiste.avatarUrl
      }
   })
     
      

   }


   const passwordHash =  await hash(password,13)

   if(points) {
    
    await this.prisma.user.update({
      where: {
         id: userId
      },
      data:{
         password: idExiste.password,
         name: idExiste.name,
         email: idExiste.email,
         points,
         avatarUrl: idExiste.avatarUrl
      }
   })
     
   } else {
  

    await this.prisma.user.update({
      where: {
         id: userId
      },
      data:{
         password: passwordHash,
         name: idExiste.name,
         email: idExiste.email,
         points,
         avatarUrl: idExiste.avatarUrl
      }
   })
     


   }


   if(name || email  || avatarUrl || points || password)  {
   await this.prisma.user.update({
      where: {
         id: userId
      },
      data:{
        name,
        email,
        password: passwordHash,
        avatarUrl,
        points
      }
   })
   }


   

   
   
    

  }


  async getUserOne(userId: string) {
    const idExiste = await this.prisma.user.findFirst({
       where: {
         id: userId
       }
    })


    if(!idExiste) {
      throw new HttpException('id is ivalid',HttpStatus.BAD_REQUEST)
    }
  

    return await this.prisma.user.findFirst({
       where: {
         id: idExiste.id
       }
    })
         
    
  }


   async getAll() {
      return await this.prisma.user.findMany()
   }




   async delele(userId:string) {
    const idExiste = await this.prisma.user.findFirst({
      where: {
        id: userId
      }
   })

   
    return await this.prisma.user.delete({
      where: {
         id: idExiste.id
      }
    })

   }


   async doneTask(points:number,userId:string) {
       
     await this.prisma.user.update({
         where: {
            id: userId
         },
         data: {
           points
         }
     })

   }


}
