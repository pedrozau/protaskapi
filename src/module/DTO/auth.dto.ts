import { ApiProperty } from '@nestjs/swagger';

export class AuthDTO {

@ApiProperty({
    description:'The email of the user',
    default: '<EMAIL>'
})
email: string;
@ApiProperty({
    description:'The password of the user',
    default: '<PASSWORD>'
})
password: string;
}