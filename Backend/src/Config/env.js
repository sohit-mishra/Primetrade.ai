require('dotenv').config();

module.exports={
    PORT:process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.0:27017/PremeTrade.ai',
    JWT_SECRET: process.env.JWT_SECRET || 'defaultSecretKey',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000', 
    REDIS_URL : process.env.REDIS_URL  || 'redis://localhost:6379'
}