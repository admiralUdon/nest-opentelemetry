import { Module } from '@nestjs/common';
import { RedisService } from 'app/core/providers/redis/redis.service';

@Module({
  exports: [RedisService],
  providers: [
    RedisService
  ]
})
export class RedisServiceModule {}