<<<<<<< HEAD
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL
      }
    },
    // 연결 설정 추가
    errorFormat: 'minimal',
    rejectOnNotFound: false,
    __internal: {
      engine: {
        connectTimeout: 10000, // 10초
        timeout: 30000, // 30초
        retry: {
          max: 3,
          backoff: { min: 1000, max: 5000 }
        }
      }
    }
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

=======
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: ['query', 'error', 'warn'],
    datasources: {
      db: {
        url: process.env.POSTGRES_PRISMA_URL
      }
    }
  })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

>>>>>>> 6f898089e01d41f9fb982fd9d24fe22a2e4afbce
export { prisma }