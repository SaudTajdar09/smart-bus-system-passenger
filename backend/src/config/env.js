import dotenv from 'dotenv'

dotenv.config()

export const env = {
  port: Number(process.env.PORT || 3001),
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/citybus',
  allowInMemoryMongo: process.env.ALLOW_IN_MEMORY_MONGO !== 'false',
  accessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  accessTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTtl: process.env.REFRESH_TOKEN_TTL || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
}
