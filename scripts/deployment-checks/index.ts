import { checkEnvironmentVariables } from './checks/env-check';
import { checkBuild } from './checks/build-check';
import { checkDatabaseConnection } from './checks/db-check';
import { checkApiEndpoints } from './checks/api-check';

async function runDeploymentChecks() {
  console.log('🚀 배포 전 검사를 시작합니다...\n');
  
  try {
    await checkEnvironmentVariables();
    await checkBuild();
    await checkDatabaseConnection();
    await checkApiEndpoints();
    
    console.log('✅ 모든 검사가 완료되었습니다!');
    process.exit(0);
  } catch (err) {
    const error = err as Error;
    console.error('❌ 검사 중 오류가 발생했습니다:', error.message);
    process.exit(1);
  }
}

runDeploymentChecks();