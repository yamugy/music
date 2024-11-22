import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { studentId, startDate, endDate } = req.query;

  try {
    const payments = await prisma.payment.findMany({
      where: {
        studentId: studentId ? Number(studentId) : undefined,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined
        }
      },
      include: {
        student: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    res.status(200).json(payments);
  } catch (error) {
    console.error('Payment Search API Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}