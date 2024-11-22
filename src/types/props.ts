import { Student, Payment, Lesson } from './models';

export interface BaseListProps {
  refreshTrigger: number;
  className?: string;
}

export interface StudentListProps extends BaseListProps {
  onEdit: (student: Student) => void;
}

export interface PaymentListProps extends BaseListProps {
  onEdit: (payment: Payment) => void;
  onPaymentsLoad: (payments: Payment[]) => void;
}

export interface LessonListProps extends BaseListProps {
  onEdit: (lesson: Lesson) => void;
}