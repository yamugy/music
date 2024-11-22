import { ApiResponse } from '@/types/common';

export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error('API 요청 실패');
  return response.json();
}

export async function deleteData(url: string): Promise<void> {
  const response = await fetch(url, { method: 'DELETE' });
  if (!response.ok) throw new Error('삭제 실패');
}