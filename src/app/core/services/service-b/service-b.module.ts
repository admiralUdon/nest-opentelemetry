import { Module } from "@nestjs/common";
import { ServiceB } from "app/core/services/service-b/service-b.service";
import { RedisServiceModule } from "../redis/redis.module";

@Module({
    imports: [RedisServiceModule],
    providers: [ServiceB], 
    exports: [ServiceB]
})
export class ServiceBModule{}