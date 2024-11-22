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
    const { currentPassword, newPassword } = req.body;
    let currentStoredPassword = 'admin123'; // 기본 비밀번호

    try {
      // data 디렉토리 생성
      await fs.mkdir(path.dirname(PASSWORD_FILE), { recursive: true });
      
      // 저장된 비밀번호 읽기 시도
      const data = await fs.readFile(PASSWORD_FILE, 'utf-8');
      currentStoredPassword = JSON.parse(data).password;
    } catch (error) {
      // 파일이 없는 경우 무시
    }

    // 현재 비밀번호 확인
    if (currentPassword !== currentStoredPassword) {
      return res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다.' });
    }

    // 새 비밀번호 저장
    await fs.writeFile(PASSWORD_FILE, JSON.stringify({ password: newPassword }));
    
    res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: '비밀번호 변경 중 오류가 발생했습니다.' });
  }
}