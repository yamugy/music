import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const studentId = Number(id);

  if (req.method === 'PUT') {
    const { name, phone, subject, note } = req.body;
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { name, phone, subject, note }
    });
    return res.json(student);
  }

  if (req.method === 'DELETE') {
    await prisma.student.delete({
      where: { id: studentId }
    });
    return res.status(204).end();
  }

  res.status(405).json({ message: 'Method not allowed' });
}