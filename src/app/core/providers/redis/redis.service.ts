/**
 * 
 * Please update this so that we can track the latest version.
 * 
 * Author           : Ahmad Miqdaad (ahmadmiqdad.aziz@teras.com.my)
 * Last Contributor : Ahmad Miqdaad (ahmadmiqdad.aziz@teras.com.my)
 * Last Updated     : 26 April 2024
 * 
 * **/

import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { redisConfig } from 'app/config/redis.config';

@Injectable()
export class RedisService {
    private readonly client: Redis;
    private DEFAULT_EXPIRATION = 10;

    constructor() {
        this.client = new Redis(redisConfig());
    }

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
        });
    }
}
