import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserDTO } from "../DTO/user.dto";
import { compare, hash } from "bcrypt";
import { AuthDTO } from "../DTO/auth.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}


  
  async createAccount({ name, email, password }: UserDTO) {
      try {
        const emailExist = await this.prisma.user.findFirst({
          where: {
            email,
          },
        });
    
        if (emailExist) {
          throw new HttpException("user already existe", HttpStatus.BAD_REQUEST);
        }
    
        const passwordHash = await hash(password, 13);
    
        return await this.prisma.user.create({
              data: {
                name,
                email,
                password: passwordHash,
              },
            });

      }catch(e) {
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

     }catch(e) {
      throw new HttpException(e.message,HttpStatus.BAD_REQUEST)
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
        }catch(e) {
          throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
        }
  }

  async getAll() {
    try {
      return await this.prisma.user.findMany();
    }catch(e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
    
  }

  async delele(userId: string) {
      try{
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
      }catch(e) {
         throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
      }
  }

  async doneTask(points: number, userId: string) {
     try{
      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          points,
        },
      });
     }catch(e) {
       throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
     }
  }

  async auth({ email, password }: AuthDTO) {
      try{
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
    
        if (!compare(password, Email.password)) {
          throw new HttpException(
            "email or password incorrect!",
            HttpStatus.BAD_REQUEST
          );
        }
    
        const payload = { sub: Email.id, email: Email.email };
    
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }catch(e) {
        throw  new HttpException(e.message,HttpStatus.BAD_REQUEST)
      }
  }
}
