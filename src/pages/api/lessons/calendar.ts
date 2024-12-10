import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { year, month } = req.query;

  try {
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0);

    const lessons = await prisma.lesson.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: { student: true },
      orderBy: { time: 'asc' }
    });

    res.status(200).json(lessons);
  } catch (error) {
    console.error('Calendar API Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}