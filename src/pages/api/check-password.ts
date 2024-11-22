
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

const PASSWORD_FILE = path.join(process.cwd(), 'data', 'password.json');

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { password } = req.body;
    let currentPassword = 'admin123'; // 기본 비밀번호

    try {
      const data = await fs.readFile(PASSWORD_FILE, 'utf-8');
      currentPassword = JSON.parse(data).password;
    } catch (error) {
      // 파일이 없는 경우 기본 비밀번호 사용
    }

    if (password === currentPassword) {
      res.status(200).json({ message: '비밀번호가 일치합니다.' });
    } else {
      res.status(401).json({ message: '비밀번호가 올바르지 않습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: '비밀번호 확인 중 오류가 발생했습니다.' });
  }
}