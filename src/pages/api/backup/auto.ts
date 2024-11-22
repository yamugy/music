
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }

  try {
    // 백업 데이터 수집
    const backup = {
      students: await prisma.student.findMany(),
      payments: await prisma.payment.findMany(),
      lessons: await prisma.lesson.findMany(),
      timestamp: new Date().toISOString(),
    };

    // 백업 디렉토리 생성
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // 백업 파일 저장
    const fileName = `backup-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(
      path.join(backupDir, fileName),
      JSON.stringify(backup, null, 2)
    );

    return res.status(200).json({ message: '자동 백업이 완료되었습니다.' });
  } catch (error) {
    console.error('Auto backup error:', error);
    return res.status(500).json({ message: '자동 백업 중 오류가 발생했습니다.' });
  }
}