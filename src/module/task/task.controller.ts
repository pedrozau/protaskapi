import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDTO } from '../DTO/task.dto';
import { TaskDoneDTO } from '../DTO/taskdone.dto';
import { AuthGuard } from '../user/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  async getbyid(@Param('id') id: string)  {
    return await this.taskService.getbyid(id)
  }
  
  

  @Get('userTask/:id')
  async getUserTask(@Param('id') id: string) {
     return this.taskService.getAllTask(id)
  }
  
  @Post('')
  @UseGuards(AuthGuard)
  createTask(@Body() data:TaskDTO) {
    return this.taskService.createTask(data)
  }
  

  @Put(':id')
  @UseGuards(AuthGuard)
 async  doneTask(@Param('id') id:string, @Body()  data:TaskDoneDTO) {
     return  this.taskService.doneTAsk(
      data.done,
      id,
      data.level,
      data.userId
     ) 
  }
  
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteTAsk(@Param('id') id:string) {
       return await this.taskService.deleteTask(id)
  }

}
