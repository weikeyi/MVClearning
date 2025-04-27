import { PrismaClient } from "@prisma/client";
import { injectable, inject } from "inversify";

@injectable()
export class PrismaDB {
    prisma: PrismaClient;

    // 直接注入 PrismaClient 实例
    constructor(@inject('PrismaClient') prisma: PrismaClient) {
        this.prisma = prisma;
    }


}
