import { User } from "@prisma/client";
import { updateUserDto } from "./dto";
import { UserService } from "./user.service";
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getMe(user: User): User;
    updateUser(userId: number, dto: updateUserDto): Promise<User>;
}
