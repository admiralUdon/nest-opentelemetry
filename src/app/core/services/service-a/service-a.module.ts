import { Module } from "@nestjs/common";
import { PrismaService } from "app/core/providers/prisma/prisma.service";
import { ServiceA } from "app/core/services/service-a/service-a.service";
import { LogServiceModule } from "../../providers/log/log.module";

@Module({
    imports: [LogServiceModule],
    providers: [ServiceA, PrismaService], 
    exports: [ServiceA]
})
export class ServiceAModule{}