import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const lessons = await prisma.lesson.findMany({
          include: { student: true },
          orderBy: { date: 'desc' }
        });
        return res.status(200).json(lessons);

      case 'POST':
        const { studentId, subject, date, time, content } = req.body;
        
        if (!studentId || !subject || !date || !time) {
          return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
        }

        const newLesson = await prisma.lesson.create({
          data: {
            studentId: Number(studentId),
            subject,
            date: new Date(date),
            time,
            content: content || ''
          },
          include: { student: true }
        });
        return res.status(201).json(newLesson);

      default:
        return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
  } catch (error) {
    console.error('Lesson API Error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}