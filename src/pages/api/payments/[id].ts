import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const paymentId = Number(id);

  try {
    switch (req.method) {
      case 'PUT':
        const { studentId, amount, method, date, memo } = req.body;
        if (!studentId || !amount || !method || !date) {
          return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
        }
        const payment = await prisma.payment.update({
          where: { id: paymentId },
          data: { 
            studentId: Number(studentId),
            amount: Number(amount),
            method,
            date: new Date(date),
            memo 
          },
          include: { student: true }
        });
        return res.json(payment);

      case 'DELETE':
        await prisma.payment.delete({
          where: { id: paymentId }
        });
        return res.status(200).json({ message: '성공적으로 삭제되었습니다.' });

      default:
        return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ 
      message: '서버 오류가 발생했습니다.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}