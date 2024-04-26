import { Module } from "@nestjs/common";
import { PrismaService } from "app/core/services/prisma/prisma.service";
import { ServiceA } from "app/core/services/service-a/service-a.service";
import { LogServiceModule } from "../log/log.module";

@Module({
    imports: [LogServiceModule],
    providers: [ServiceA, PrismaService], 
    exports: [ServiceA]
})
export class ServiceAModule{}