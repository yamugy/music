import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const payments = await prisma.payment.findMany({
          include: { student: true },
          orderBy: { date: 'desc' }
        });
        return res.status(200).json(payments);

      case 'POST':
        const { studentId, amount, method, date, memo } = req.body;
        
        if (!studentId || !amount || !method || !date) {
          return res.status(400).json({ message: '필수 필드가 누락되었습니다.' });
        }

        const newPayment = await prisma.payment.create({
          data: {
            studentId: Number(studentId),
            amount: Number(amount),
            method,
            date: new Date(date),
            memo: memo || ''
          },
          include: { student: true }
        });
        return res.status(201).json(newPayment);

      default:
        return res.status(405).json({ message: '허용되지 않는 메소드입니다.' });
    }
  } catch (error) {
    console.error('Payment API Error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
}