import { Module } from '@nestjs/common';
import { LogServiceModule } from 'app/core/services/log/log.module';
import { HelloController } from 'app/modules/hello/hello.controller';

@Module({
  imports: [LogServiceModule],
  controllers: [HelloController],
})
export class HelloModule {}