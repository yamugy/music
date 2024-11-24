import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function checkBuild() {
  console.log('🏗️ 프로덕션 빌드를 테스트합니다...');
  
  try {
    await execAsync('npm run build');
    console.log('✅ 빌드 테스트 완료\n');
  } catch (error) {
    throw new Error(`빌드 실패: ${(error as Error).message}`);
  }
}