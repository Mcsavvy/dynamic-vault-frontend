'use server';

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGO_URI || '';

// This approach prevents multiple connections in development
// @ts-expect-error mongoose is not defined on global
const cached = global.mongoose || { conn: null, promise: null };

if (!cached.promise) {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGO_URI environment variable');
  }

  cached.promise = mongoose.connect(MONGODB_URI)
    .then((mongoose) => {
      console.log('MongoDB connected successfully');
      return mongoose;
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB:', err);
      throw err;
    });
}

// @ts-expect-error mongoose is not defined on global
global.mongoose = cached;

export default async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Register the models
// The models will be imported and executed here automatically
import './lib/models';