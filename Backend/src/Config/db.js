const env = require('@/Config/env');
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`)
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB disconnected due to app termination');
            process.exit(0);
        });
    } catch (error) {
        console.log("Error connnecting to DB:", error)
    }
}

module.exports = connectDB;