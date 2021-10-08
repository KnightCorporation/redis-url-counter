import { createClient } from 'redis';

const HLL = 'app:HLL';
export let redisClient;

export const connectToRedis = async () => {
  redisClient = createClient();

  redisClient.on('error', (err) => console.log('Redis error', err));

  await redisClient.connect();
  await redisClient.del(HLL);
  return redisClient;
};

export const addToHLL = async value => {
  await redisClient.pfAdd(HLL, value);
};

export const countHLL = async () => {
  return await redisClient.pfCount(HLL);
};
