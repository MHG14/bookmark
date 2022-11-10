import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { updateUserDto } from "./dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async updateUser(userId: number, dto: updateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });

    delete user.hashedPassword;
    return user;
  }
}
