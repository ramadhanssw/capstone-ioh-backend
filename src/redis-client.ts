import { createClient } from "redis"

const {
  REDIS_URL = 'redis://localhost:6379'
} = process.env

const RedisCacheClient = createClient(REDIS_URL)

RedisCacheClient.on('error', err => console.log(`Redis error: ${err}`))

export default RedisCacheClient