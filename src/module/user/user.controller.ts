import { Body, Controller, Get, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDTO } from '../DTO/user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import multer, { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from './auth.guard';
import { AuthDTO } from '../DTO/auth.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CheckTokenDTO } from '../DTO/ckeckToken.dto';


@ApiBearerAuth()
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
 
  

  @Post('account')
  async createAccount(@Body() data: UserDTO) {
      return await  this.userService.createAccount(data)
  }
   
  @Get('account')
  @UseGuards(AuthGuard)
  async getAll() {
   
     return await this.userService.getAll() 

  }
  
  @Get('account/:id')
  @UseGuards(AuthGuard)
  async getOne(@Param('id')  id: string) {

        return await this.userService.getUserOne(id)

  }
  
  
  @Put('account/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './files',
      filename: (req, file,callback) => {
         const uniqueSuffix = Date.now() + '-' + Math.floor(Math.random() * 1e9)
         const ext = extname(file.originalname) 
         const filename = `${file.originalname}-${uniqueSuffix}${ext}` 

         callback(null,filename)
      }
    })
  }))
  async update(@UploadedFile() file: Express.Multer.File,@Body() {name,email,password,points}: UserDTO, @Param('id')  id: string) {

      return await this.userService.updateAccount(
        {
          name,
          email,
          password,
          points,
          avatarUrl: file.filename,

        },id
      )
  }

  

  @Post('auth')
  async signIn(@Body() data: AuthDTO) {

    return await this.userService.auth(data)

  }
  

  @Get('check_expiration_token')
  async checkToken(@Body() token:CheckTokenDTO ) {

      return this.userService.checkExpirationToken(token)

  }

}
