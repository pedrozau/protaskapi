import { ApiProperty } from "@nestjs/swagger";

export class UserDTO {
  @ApiProperty({
    description: "The name of the user",
    default: "<NAME>",
  })
   name: string;
   @ApiProperty({
    description: "The email of the user",
    default: "<EMAIL>",
   })
    email: string;
    @ApiProperty({
      description: "The password of the user",
        default: "<PASSWORD>",
    })
    password: string;
    @ApiProperty({
      description: "The points of the user",
        default: 0,
    })
    points?: number;
    @ApiProperty({
      description: "The avatarUrl of the user",
        default: "https://i.pinimg.com/originals/05/05/22/0505229198420394888856.jpg",
    })
    avatarUrl?: string;
}