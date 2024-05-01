/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdad.aziz@teras.com.my)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdad.aziz@teras.com.my)
 * Last Updated     : 26 April 2024
 * 
 * **/

import { Injectable, Logger } from '@nestjs/common';
import { ISO8601Date } from 'app/core/utils/date.util';
import { convertSizeToBytes } from 'app/core/utils/size-conversion.util';
import { readFileSync } from 'fs-extra';
import { join, resolve } from 'path';
import * as winston from 'winston';

interface TransactionI {
    type            : "start" | "end";
    data            : {
        timestamp       : string;
        url?            : string;
        ip?             : string;
        requestBody?    : string;
        responseBody?   : string;
        responseTime?   : number;
    }
}

@Injectable()
export class LogService extends Logger {
    
    private readonly logger: winston.Logger;
    private readonly folderPath = resolve(process.env.FILE_LOG_PATH ?? "./src/storage/logs");

    constructor(
        readonly moduleName?: string
    ) {

        super(moduleName);

        try {

            // Check if logger is enabled
            const transports = this.getTransports();
            
            if (transports.length > 0) {
    
                // Create a custom format
                const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
                    const { type, data } = metadata;
                    const { url, ip, timestamp: trxTimestamp, requestBody, responseBody, responseTime } = data ?? {};
                    const datetime = trxTimestamp ?? timestamp;
                    if(type === "start") {
                        return `[${datetime}] - START - ${ip} - ${url} - Request Body : ${requestBody}`
                    }
                    if(type === "end") {
                        return `[${datetime}] - END - Response Body : ${responseBody} -  Response Time: ${responseTime}ms`
                    }
                    const formattedMetadata = Object.keys(metadata).length ? ` ${JSON.stringify(metadata)}` : '';
                    return `[${datetime}] - ${level.toUpperCase()} - Message: ${message} - Additional Data: ${formattedMetadata}`;
                });
    
                // Write logs
                this.logger = winston.createLogger({
                    level: 'debug', // Default level
                    format: winston.format.combine(
                        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), // Add timestamp
                        customFormat
                    ),
                    transports,
                });
            }
        } catch(error) {
            throw new Error(error);
        }

        
    }

    transaction(params: TransactionI) {
        const { type, data } = params;
        this.logger.info(null, { type, data })
    }

    log(message: string, optionalParams?: any) {
        if (optionalParams === undefined) {
            super.log(message);
        } else {
            optionalParams = typeof optionalParams === 'string' ? { message, optionalParams } : optionalParams;
            super.log(message, optionalParams);
        }

        this.logger.info(message, optionalParams);
    }

    error(message: string, trace?: string) {
        super.error(message, trace);
        this.logger.error(message, { trace });
    }

    warn(message: string, optionalParams?: any) {
        if (optionalParams === undefined) {
            super.log(message);
        } else {
            optionalParams = typeof optionalParams === 'string' ? { message, optionalParams } : optionalParams;
            super.log(message, optionalParams);
        }
        this.logger.warn(message, optionalParams);
    }

    debug(message: string, optionalParams?: any) {        
        if (optionalParams === undefined) {
            super.log(message);
        } else {
            optionalParams = typeof optionalParams === 'string' ? { message, optionalParams } : optionalParams;
            super.log(message, optionalParams);
        }
        this.logger.debug(message, optionalParams);
    }

    verbose(message: string, optionalParams?: any) {
        if (optionalParams === undefined) {
            super.log(message);
        } else {
            optionalParams = typeof optionalParams === 'string' ? { message, optionalParams } : optionalParams;
            super.log(message, optionalParams);
        }
        this.logger.verbose(message, optionalParams);
    }

    getTransports()
    {

        // Console
        const consoleTransport = process.env.CONSOLE_LOGGING === "true" ? new winston.transports.Console() : undefined;

        // File
        const todayDate = new Date();
        const fileName = `${ISO8601Date(todayDate)}-APP.log`;
        const maxSizeBytes = convertSizeToBytes(1, "GB");
        const fileTransport = process.env.FILE_LOGGING === "true" ? new winston.transports.File({ 
            filename    : join(this.folderPath, fileName),
            maxsize     : maxSizeBytes
        }) : undefined;


        return [fileTransport, consoleTransport].filter(n => n);
    }
}
