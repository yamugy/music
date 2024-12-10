export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SortDirection = 'asc' | 'desc';
export type SortType = 'date' | 'student' | 'time';

export interface BaseListProps {
  refreshTrigger: number;
  className?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DateFormatOptions {
  format?: 'yyyy-MM-dd' | 'yyyy.MM.dd' | 'yy-MM-dd';
  separator?: '-' | '.' | '/';
}