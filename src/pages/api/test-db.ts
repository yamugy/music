import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 데이터베이스 연결 확인
    await prisma.$connect();
    
    // 간단한 쿼리 실행
    const testResult = await prisma.$queryRaw`SELECT current_timestamp;`;
    
    return res.status(200).json({
      success: true,
      message: '데이터베이스 연결 성공',
      data: testResult,
      env: {
        nodeEnv: process.env.NODE_ENV,
        dbUrl: process.env.DATABASE_URL ? '설정됨' : '설정안됨',
        prismaUrl: process.env.POSTGRES_PRISMA_URL ? '설정됨' : '설정안됨'
      }
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: '데이터베이스 연결 실패',
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : String(error)
    });
  } finally {
    await prisma.$disconnect();
  }
}