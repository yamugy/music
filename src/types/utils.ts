export type SortDirection = 'asc' | 'desc';
export type SortType = 'date' | 'student' | 'time';

export interface BaseListProps {
  refreshTrigger: number;
  className?: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 날짜 포맷 유틸리티 타입
export interface DateFormatOptions {
  format?: 'yyyy-MM-dd' | 'yyyy.MM.dd' | 'yy-MM-dd';
  separator?: '-' | '.' | '/';
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}