import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const students = await prisma.student.findMany({
        orderBy: { name: 'asc' },
        select: {
          id: true,
          name: true,
          phone: true,
          subject: true,
          note: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      
      console.log('API response:', students); // 서버 측 로그
      return res.status(200).json(students);
    }

    switch (req.method) {
      case 'POST':
        const newStudent = await prisma.student.create({
          data: req.body,
        });
        return res.status(201).json(newStudent);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false,
      message: '서버 내부 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? String(error) : undefined
    });
  }
}