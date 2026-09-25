const mongoose = require('mongoose');

/**
 * MongoDB Connection Configuration
 * Connects to MongoDB Atlas or local MongoDB instance
 */

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        console.log(`📦 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        
        // More helpful error messages
        if (error.message.includes('ECONNREFUSED')) {
            console.error('💡 Make sure MongoDB is running (local) or check your Atlas connection string');
        } else if (error.message.includes('authentication failed')) {
            console.error('💡 Check your MongoDB username and password in .env');
        } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
            console.error('💡 Check your connection string - host might be incorrect');
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;
