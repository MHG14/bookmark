import { PrismaService } from "../prisma/prisma.service";
import { updateUserDto } from "./dto";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    updateUser(userId: number, dto: updateUserDto): Promise<import(".prisma/client").User>;
}
