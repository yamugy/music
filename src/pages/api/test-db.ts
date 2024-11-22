import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 데이터베이스 연결 테스트
    const testResult = await prisma.$queryRaw`SELECT NOW()`;
    
    return res.status(200).json({
      success: true,
      message: '데이터베이스 연결 성공',
      data: testResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({
      success: false,
      message: '데이터베이스 연결 실패',
      error: error instanceof Error ? error.message : '알 수 없는 오류'
    });
  }
}