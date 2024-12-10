export async function checkApiEndpoints() {
  console.log('🌐 API 엔드포인트를 테스트합니다...');
  
  const endpoints = [
    '/api/students',
    '/api/lessons',
    '/api/payments'
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`);
      if (!response.ok) {
        throw new Error(`${endpoint} 응답 실패: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`API 테스트 실패 (${endpoint}): ${(error as Error).message}`);
    }
  }

  console.log('✅ API 테스트 완료\n');
}