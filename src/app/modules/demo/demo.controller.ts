import { Controller, Get, HttpStatus, InternalServerErrorException, Query, Request, Response } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { LogService } from 'app/core/services/log/log.service';
import { PrismaService } from 'app/core/services/prisma/prisma.service';
import { AppCode } from 'app/core/types/app.type';
import { DefaultHttpException } from 'app/shared/custom/http-exception/default.http-exception';
import { DefaultHttpResponse } from 'app/shared/custom/http-response/default.http-response';
import { context, trace } from '@opentelemetry/api';
import { ServiceA } from 'app/core/services/service-a/service-a.service';
import { ServiceB } from 'app/core/services/service-b/service-b.service';

@Controller()
export class DemoController {

    constructor(
        private readonly _logService: LogService,
        private readonly _serviceA: ServiceA,
        private readonly _serviceB: ServiceB,
    ){
    }

    @Get()
    @ApiOperation({ summary: "Display Demo", description: "A simple greeting API that returns a friendly \"Hello, World!\" message when accessed. It serves as a basic example or placeholder for API testing and demonstration purposes" })
    async getHello(
        @Request() request,
        @Response() response,
    ) {

        const span = trace.getTracer('default').startSpan('DemoController.getHello start');
        span.setAttribute('test from demo controller', true);
        span.end();

        try {

            // Calling service A
            const timestamp = await this._serviceA.getTimestamp();
            
            // Calling service B
            const cacheTimestamp = await this._serviceB.getCacheTimestamp(request.url, timestamp);
    
            const successCode = AppCode.OK;
            const result = new DefaultHttpResponse({
                code: successCode.code,
                message: successCode.description,
                statusCode: successCode.status,
                data: {
                    cacheTimestamp
                }
            });
            
            response.status(result.statusCode);
            response.json(result);
            return response;
            
        } catch (error) {
            span.recordException(new Error(error));
            throw new DefaultHttpException(error);
        } finally {
            const span = trace.getTracer('default').startSpan('DemoController.getHello end');
            span.setAttribute('test from demo controller', true);
            span.end();
        }
        
    }

}
