import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const lessonId = Number(id);

  try {
    switch (req.method) {
      case 'PUT':
        const { studentId, subject, date, time, content } = req.body;
        const lesson = await prisma.lesson.update({
          where: { id: lessonId },
          data: { 
            studentId: Number(studentId),
            subject,
            date: new Date(date),
            time,
            content 
          },
          include: { student: true }
        });
        return res.json(lesson);

      case 'DELETE':
        await prisma.lesson.delete({
          where: { id: lessonId }
        });
        return res.status(204).end();

      default:
        return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
  } catch (error) {
    console.error('Lesson API Error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}