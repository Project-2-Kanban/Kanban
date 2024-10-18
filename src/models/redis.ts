import Redis from "ioredis";
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path:path.resolve(__dirname,'../../.env')});

const redis = new Redis({
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,
    host: process.env.REDIS_HOST,
});

export default redis;