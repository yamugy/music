export async function checkEnvironmentVariables() {
  const requiredEnvVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL'
  ];

  console.log('📝 환경 변수를 검사합니다...');
  
  const missingVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missingVars.length > 0) {
    throw new Error(`다음 환경 변수가 없습니다: ${missingVars.join(', ')}`);
  }

  console.log('✅ 환경 변수 검사 완료\n');
}