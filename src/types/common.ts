export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SortDirection = 'asc' | 'desc';
export type SortType = 'date' | 'student' | 'time';

export interface ListProps {
  refreshTrigger: number;
  className?: string;
}