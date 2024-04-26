import { Module } from '@nestjs/common';
import { RedisService } from 'app/core/services/redis/redis.service';

@Module({
  exports: [RedisService],
  providers: [
    RedisService
  ]
})
export class RedisServiceModule {}