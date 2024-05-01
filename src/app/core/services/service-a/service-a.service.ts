
import { Injectable } from "@nestjs/common";
import { PrismaService } from "app/core/providers/prisma/prisma.service";
import { trace, SpanStatusCode } from '@opentelemetry/api';
import { LogService } from "app/core/providers/log/log.service";
import { Prisma } from "@prisma/client";

@Injectable()
export class ServiceA {
    
    /**
     * Constructor
     */

    constructor (
        private readonly _prismaService: PrismaService,
        private readonly _logService: LogService
    ){
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async getTimestamp(): Promise<any | null> {

        // Tracing
        const span = trace.getTracer('default').startSpan('ServiceA.postgresql.getTimestamp');

        try {

            // Database query
            const query: Prisma.Sql = Prisma.sql`SELECT NOW()`;

            // Logging
            this._logService.debug("ServiceA.postgresql.getTimestamp REQ", query);

            // Database operation
            const [timestamp] = await this._prismaService.$queryRaw(query) as any;

            // Logging
            this._logService.debug("ServiceA.postgresql.getTimestamp RESP", timestamp);

            // Tracing
            span.setAttribute('test from ServiceA', true);

            return timestamp;
        } catch (error) {            
            span.recordException(new Error(error));
            span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
            throw new Error(error);
        } finally {
            span.end();
        }
    }
}