import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const studentId = Number(req.query.id);

  if (isNaN(studentId)) {
    return res.status(400).json({ error: '유효하지 않은 학생 ID입니다.' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const student = await prisma.student.findUnique({
          where: { id: studentId }
        });
        if (!student) {
          return res.status(404).json({ error: '학생을 찾을 수 없습니다.' });
        }
        return res.status(200).json(student);

      case 'PUT':
        const updatedStudent = await prisma.student.update({
          where: { id: studentId },
          data: req.body
        });
        return res.status(200).json(updatedStudent);

      case 'DELETE':
        await prisma.student.delete({
          where: { id: studentId }
        });
        return res.status(204).end();

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: '서버 내부 오류가 발생했습니다.' });
  }
}