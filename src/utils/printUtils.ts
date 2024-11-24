/* 프린트 유틸리티 함수 모음 */
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// 프린트 실행 함수
export const handlePrint = (elementId: string): void => {
  const content = document.getElementById(elementId);
  if (!content) {
    console.error('프린트할 요소를 찾을 수 없습니다.');
    return;
  }
  window.print();
};

// 날짜 포맷팅 함수
export const formatPrintDate = (dateInput: Date | string | null): string => {
  if (!dateInput) return '-';
  
  try {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return '-';
    }
    
    return format(date, 'yyyy년 MM월 dd일', { locale: ko });
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
};

// 금액 포맷팅 함수
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW'
  }).format(amount);
};