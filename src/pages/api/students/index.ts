import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const students = await prisma.student.findMany({
          select: {
            id: true,
            name: true,
            phone: true,    // 추가
            subject: true,
            note: true      // 추가
          },
          orderBy: {
            name: 'asc'
          }
        });
        return res.status(200).json(students);

      case 'POST':
        const { name, phone, subject, note } = req.body;
        
        if (!name) {
          return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
        }

        const newStudent = await prisma.student.create({
          data: {
            name,
            phone: phone || '',
            subject: subject || '',
            note: note || ''
          },
          select: {
            id: true,
            name: true,
            phone: true,
            subject: true,
            note: true
          }
        });
        return res.status(201).json(newStudent);

      default:
        return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: '서버 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}