import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDTO } from "../DTO/user.dto";
import { compare, compareSync, hash } from "bcrypt";
import { AuthDTO } from "../DTO/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { CheckTokenDTO } from "../DTO/ckeckToken.dto";
import { jwtContants } from "./constants";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) { }



  async createAccount({ name, email, password }: UserDTO) {
    try {
      const avatarURL = "https://cdn.pixabay.com/photo/2020/10/11/19/51/cat-5646889_960_720.jpg"
      const emailExist = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (emailExist) {
        throw new HttpException("user already existe", HttpStatus.BAD_REQUEST);
      }

      const passwordHash = await hash(password, 13);

      const userData =  await this.prisma.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          avatarUrl: avatarURL
        },
      });

      const payload = { sub: userData.id, email: email };

      return {
        access_token: await this.jwtService.signAsync(payload),
        user: userData
      };

    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async updateAccount(
    { password, name, email, avatarUrl, points }: UserDTO,
    userId: string
  ) {

    try {

      const idExiste = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!idExiste) {
        throw new HttpException("id is invalid!", HttpStatus.BAD_REQUEST);
      }

      if (!password) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: idExiste.password,
            name: idExiste.name,
            email: idExiste.email,
            points: idExiste.points,
            avatarUrl: idExiste.avatarUrl,
          },
        });
      }

      const passwordHash = await hash(password, 13);

      if (points) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: idExiste.password,
            name: idExiste.name,
            email: idExiste.email,
            points,
            avatarUrl: idExiste.avatarUrl,
          },
        });
      } else {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: passwordHash,
            name: idExiste.name,
            email: idExiste.email,
            points,
            avatarUrl: idExiste.avatarUrl,
          },
        });
      }

      if (name || email || avatarUrl || points || password) {
        await this.prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            name,
            email,
            password: passwordHash,
            avatarUrl,
            points,
          },
        });
      }

    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }

  }

  async getUserOne(userId: string) {
    try {
      const idExiste = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!idExiste) {
        throw new HttpException("id is ivalid", HttpStatus.BAD_REQUEST);
      }

      return await this.prisma.user.findFirst({
        where: {
          id: idExiste.id,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async getAll() {
    try {
      return await this.prisma.user.findMany();
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }

  }

  async delele(userId: string) {
    try {
      const idExiste = await this.prisma.user.findFirst({
        where: {
          id: userId,
        },
      });

      return await this.prisma.user.delete({
        where: {
          id: idExiste.id,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async doneTask(points: number, userId: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          points,
        },
      });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async auth({ email, password }: AuthDTO) {
    try {
      const Email = await this.prisma.user.findFirst({
        where: {
          email,
        },
      });

      if (!Email) {

        throw new HttpException(
          "email or password incorrect!",
          HttpStatus.BAD_REQUEST
        );
      }
    
      const compare_pass =  compareSync(password, Email.password)
          
      if (!compare_pass) {

        throw new HttpException(
          "email or password incorrect!",
          HttpStatus.BAD_REQUEST
        );



      } else {
        const payload = { sub: Email.id, email: Email.email };

        return {
          access_token: await this.jwtService.signAsync(payload),
          user: Email
        };
        
      }


    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

  async checkExpirationToken({ token }: CheckTokenDTO) {

    try {

      await this.jwtService.verifyAsync(token, {
        secret: jwtContants.secret
      })

    } catch (e) {

      throw new UnauthorizedException()

    }

    return {
      access: true
    }

  }


  async bestUserPoints() {

    try {

      return await this.prisma.user.findMany({
        select: {
          points: true,
          email: true,
          avatarUrl: true,
          online: true,
          name: true
        },
        orderBy: {
          points: 'desc'
        }
      })


    } catch (e) {

      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)

    }

  }

  async online(userId: string) {
      try {

        const userData =  await this.prisma.user.findFirst({
           where: {
            id: userId
           }
        })

        if(!userData.id) {
          throw new HttpException("Id is invalid!", HttpStatus.BAD_REQUEST)
        }

        const onlineUser = true

         const  checkStatus = await this.prisma.user.update({
            where: {
               id: userData.id
            },
            data:{
              email: userData.email,
              name: userData.name,
              password: userData.password,
              online: onlineUser
            }
         })

         return checkStatus

      }catch(e) {
        throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
      }
  }

  async offline(userId: string) {
    try {

      const userData =  await this.prisma.user.findFirst({
         where: {
          id: userId
         }
      })

      if(!userData.id) {
        throw new HttpException("Id is invalid!", HttpStatus.BAD_REQUEST)
      }

      const onlineUser = false

       const  checkStatus = await this.prisma.user.update({
          where: {
             id: userData.id
          },
          data:{
            email: userData.email,
            name: userData.name,
            password: userData.password,
            online: onlineUser
          }
       })

       return checkStatus

    }catch(e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST)
    }
  }

}
