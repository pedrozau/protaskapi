import { Body, Controller, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDTO } from '../DTO/task.dto';
import { TaskDoneDTO } from '../DTO/taskdone.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  
  @Post('')
  createTask(@Body() data:TaskDTO) {
    return this.taskService.createTask(data)
  }
  

  @Put(':id')
 async  doneTask(@Param('id') id:string, @Body()  data:TaskDoneDTO) {
     return  this.taskService.doneTAsk(
      data.done,
      id,
      data.level,
      data.userId
     ) 
  }

}
