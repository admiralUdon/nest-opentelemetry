/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdaadz[at]gmail.com)
 * Last Updated     : 1 May 2024
 * 
 * **/

import { Injectable, Logger } from '@nestjs/common';
import { Redis, RedisOptions } from 'ioredis';
import { redisConfig } from 'app/config/redis.config';

@Injectable()
export class RedisService {

    private client: Redis;
    private config: RedisOptions;
    private DEFAULT_EXPIRATION = 10;
    private readonly logger = new Logger(RedisService.name);

    /**
     * Constructor
     */
    
    constructor() {
        this.initialiseDb();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    async getOrSetCache(key, callback) {
        return new Promise((resolve, reject) => {
            this.client.get(key, async (error, data) => {
                if (error) return reject(error);
                if (data != null) return resolve(JSON.parse(data))
                const freshData = await callback();
                this.client.setex(key, this.DEFAULT_EXPIRATION, JSON.stringify(freshData));
                resolve(freshData);
            })
        })
    }

    async getInfo(): Promise<{ [key: string]: string }>{
        const info = await this.client.info();
        const lines = info.split('\r\n');
        const infoObject: { [key: string]: string } = {};
        for (const line of lines) {
            const parts = line.split(':');
            if (parts.length === 2) {
                const key = parts[0];
                const value = parts[1];
                infoObject[key] = value.trim();
            }
        }
        return infoObject;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    private async initialiseDb() {
        try {
            this.config = redisConfig();
            this.client = new Redis(this.config);
            this.logger.debug(`Redis Database successfully initialized`);
        } catch (error) {
            this.logger.error(`Failed to initialize Redis Client: ${error}`);
        }
    }
}