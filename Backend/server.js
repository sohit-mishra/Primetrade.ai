require('module-alias/register');
const express = require('express');
const connectDB = require('@/Config/db');
const env = require('@/Config/env');
const cors = require('cors');
const errorLogger = require('@/Middlewares/errorLogger');
const router = require('@/Routers/index');

const app = express();

connectDB();

app.use(cors({
    origin: env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

app.use(errorLogger);

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

app.use('/api/v1', router);

app.listen(env.PORT, () => {
    console.log(`Server is running on: http://localhost:${env.PORT}`);
});
