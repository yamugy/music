import { ApiResponse } from '@/types/common';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(`${API_URL}${url}`);
  if (!response.ok) {
    console.error('API Error:', await response.text());
    throw new Error('API 요청 실패');
  }
  return response.json();
}

export async function deleteData(url: string): Promise<void> {
  const response = await fetch(`${API_URL}${url}`, { 
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (!response.ok) {
    console.error('Delete Error:', await response.text());
    throw new Error('삭제 실패');
  }
}