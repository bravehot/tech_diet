import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async set(key: string, value: string | number, ttl?: number): Promise<void> {
    if (ttl) {
      await this.redisClient.set(key, value, {
        EX: ttl,
      });
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async get(key: string): Promise<string | null> {
    return await this.redisClient.get(key);
  }
}
