
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
  }

  const { backup } = req.body;

  try {
    // 트랜잭션으로 모든 데이터 복원
    await prisma.$transaction(async (tx) => {
      // 기존 데이터 삭제
      await tx.payment.deleteMany();
      await tx.lesson.deleteMany();
      await tx.student.deleteMany();

      // 백업 데이터 복원
      if (backup.students?.length) {
        await tx.student.createMany({ data: backup.students });
      }
      if (backup.payments?.length) {
        await tx.payment.createMany({ data: backup.payments });
      }
      if (backup.lessons?.length) {
        await tx.lesson.createMany({ data: backup.lessons });
      }
    });

    return res.status(200).json({ message: '백업이 성공적으로 복원되었습니다.' });
  } catch (error) {
    console.error('Restore error:', error);
    return res.status(500).json({ message: '백업 복원 중 오류가 발생했습니다.' });
  }
}