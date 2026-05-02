import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { env } from './env.js'

let memoryServer = null

export async function connectDB() {
  try {
    await mongoose.connect(env.mongoUri)
    console.log(`MongoDB connected at ${env.mongoUri}`)
    return
  } catch (error) {
    if (!env.allowInMemoryMongo) {
      throw error
    }
    console.warn(`MongoDB unavailable at ${env.mongoUri}; starting in-memory MongoDB`)
  }

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create()
  }
  const inMemoryUri = memoryServer.getUri('citybus')
  await mongoose.connect(inMemoryUri)
  console.log(`In-memory MongoDB connected at ${inMemoryUri}`)
}
