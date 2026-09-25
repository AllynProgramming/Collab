const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing. Add it to your .env file.');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    if (error.message.includes('ECONNREFUSED')) {
      console.error('Make sure MongoDB is running locally or check your Atlas connection string.');
    } else if (error.message.includes('authentication failed')) {
      console.error('Check your MongoDB username and password in .env.');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('Check your MongoDB host in the Atlas connection string.');
    }

    process.exit(1);
  }
};

module.exports = connectDB;
