import { PrismaClient } from '@prisma/client';

export async function checkDatabaseConnection() {
  console.log('🔌 데이터베이스 연결을 테스트합니다...');
  
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    await prisma.student.findFirst();
    console.log('✅ 데이터베이스 연결 테스트 완료\n');
  } catch (error) {
    throw new Error(`데이터베이스 연결 실패: ${(error as Error).message}`);
  } finally {
    await prisma.$disconnect();
  }
}