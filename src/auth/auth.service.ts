import { ForbiddenException, Injectable } from "@nestjs/common";
import { User, Bookmark } from "@prisma/client";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}
  async register(dto: AuthDto) {
    try {
      //generate the password hash
      const hashedPassword = await argon.hash(dto.password);
      //save the new user
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hashedPassword: hashedPassword,
        },
      });

      // return the JWT
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if ((error.code = "P2002")) {
          throw new ForbiddenException("Credentials taken");
        }
      }
      throw error;
    }
  }

  async login(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    // if user does not exist throw an exception
    if (!user) throw new ForbiddenException("Credentials incorrect");
    // compare password
    const pwdMatches = await argon.verify(user.hashedPassword, dto.password);
    // if password was wrong throw an exception
    if (!pwdMatches) throw new ForbiddenException("Credentials incorrect");
    // return the JWT
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const accessTokenSecret = this.config.get("ACCESS_TOKEN_SECRET");

    const JWToken = await this.jwt.signAsync(payload, {
      expiresIn: "15m",
      secret: accessTokenSecret,
    });

    return {
      access_token: JWToken,
    };
  }
}
