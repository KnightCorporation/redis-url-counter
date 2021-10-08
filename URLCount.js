import express from 'express';
import * as redis from './redisHLL.js';

/* const redisClient = */ await redis.connectToRedis();

const app = express();
const port = 3000;

app.use(async (req, res, next) => {
    try {
        decodeURI(req.url);
    } catch(e) {
        console.log(`ERROR: Request received at INVALID URI ${req.url}`);
        const count = await redis.countHLL();
        res.send(`That was an invalid URL, won't count. ${count} unique URLs have been requested.`);
    }
    next();
});

app.get('*', async (req,res) => {
    const decodedURI = decodeURI(req.url);
    console.log(`INFO: Request received at ${decodedURI}`);
    await redis.addToHLL(decodedURI);
    const count = await redis.countHLL();
    res.send(`${count} unique URLs have been requested.`);
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
