
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }

  try {
    // 모든 데이터 가져오기
    const backup = {
      students: await prisma.student.findMany(),
      payments: await prisma.payment.findMany(),
      lessons: await prisma.lesson.findMany(),
      timestamp: new Date().toISOString(),
    };

    // JSON 파일 이름 생성
    const fileName = `backup-${new Date().toISOString().split('T')[0]}.json`;
    
    // 파일 다운로드를 위한 헤더 설정
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    
    return res.status(200).json(backup);
  } catch (error) {
    console.error('Backup error:', error);
    return res.status(500).json({ message: '백업 생성 중 오류가 발생했습니다.' });
  }
}