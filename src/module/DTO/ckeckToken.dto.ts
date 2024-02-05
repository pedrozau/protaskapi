import { ApiProperty } from "@nestjs/swagger";

export class CheckTokenDTO {

    @ApiProperty({
        description: 'The user token'
    })
     token: string 

}

