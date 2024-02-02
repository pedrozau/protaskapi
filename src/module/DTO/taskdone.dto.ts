import { ApiProperty } from "@nestjs/swagger";

export class TaskDoneDTO {
     @ApiProperty({
          description:'The task of the user',
          default: false
     })
     done: boolean;
     @ApiProperty({
          description:'The level of the task',
     })
     level: number;
     @ApiProperty({
          description:'The userId of the user',
     })
     userId: string;
}