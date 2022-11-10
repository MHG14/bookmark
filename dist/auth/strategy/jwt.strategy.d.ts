import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private config;
    private jwt;
    constructor(prisma: PrismaService, config: ConfigService, jwt: JwtService);
    validate(payload: {
        sub: number;
        email: string;
    }): Promise<import(".prisma/client").User>;
}
export {};
