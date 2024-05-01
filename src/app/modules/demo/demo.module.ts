import { Module } from '@nestjs/common';
import { LogServiceModule } from 'app/core/providers/log/log.module';
import { ServiceAModule } from 'app/core/services/service-a/service-a.module';
import { ServiceBModule } from 'app/core/services/service-b/service-b.module';
import { DemoController } from 'app/modules/demo/demo.controller';

@Module({
  imports: [LogServiceModule, ServiceAModule, ServiceBModule],
  controllers: [DemoController],
  providers: []
})
export class DemoModule {}