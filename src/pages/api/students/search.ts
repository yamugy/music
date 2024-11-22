import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { query } = req.query;

  try {
    const students = await prisma.student.findMany({
      where: {
        name: {
          contains: query as string
        }
      }
    });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  } finally {
    await prisma.$disconnect();
  }
}