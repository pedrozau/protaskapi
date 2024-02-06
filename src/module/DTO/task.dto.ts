import { ApiProperty } from "@nestjs/swagger";

export  class TaskDTO {
    @ApiProperty({
        description:'The task of the user',
        default: 'Task'
    })
    task:string;
    @ApiProperty({
        description:'The level of the user',
        default: 'run'
    })
    level:number;
    @ApiProperty({
        description:'the user done the task',
        default: 1
    })
    done:boolean;
    @ApiProperty({
        description:'The userId of the user',
        default: '1'
    })
    userId:string;
}