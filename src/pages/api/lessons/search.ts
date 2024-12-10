import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { studentId, startDate, endDate } = req.query;

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        studentId: studentId ? Number(studentId) : undefined,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        }
      },
      include: { student: true },
      orderBy: { date: 'asc' }
    });
    res.status(200).json(lessons);
  } catch (error) {
    console.error('Lesson Search API Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}