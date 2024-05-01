
import { Injectable } from "@nestjs/common";
import { RedisService } from "app/core/providers/redis/redis.service";
import { trace, SpanStatusCode } from '@opentelemetry/api';

@Injectable()
export class ServiceB {
    
    constructor (
        private readonly _redisService: RedisService
    ){
    }

    async getCacheTimestamp(key, timestamp): Promise<any | null> {

        const span = trace.getTracer('default').startSpan('ServiceB.redis.getCacheTimestamp');

        try {
            const data = await this._redisService.getOrSetCache(key, () => {
                return {
                    message: "next response will be cached for 10 second!!",
                    timestamp
                }
            });
            span.setAttribute('test from ServiceB', true);
            return data;
        } catch (error) {
            span.recordException(new Error(error));
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            return null;
        } finally {
            span.end();
        }
    }
}