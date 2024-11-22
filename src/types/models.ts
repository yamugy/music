export interface BaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Student extends BaseEntity {
  name: string;
  phone: string;
  subject: string;
  note: string;
}

export interface Payment extends BaseEntity {
  studentId: number;
  amount: number;
  method: string;
  date: string;
  memo?: string;
  student: {
    name: string;
  };
}

export interface Lesson extends BaseEntity {
  studentId: number;
  subject: string;
  date: string;
  time: string;
  content?: string;
  student: {
    name: string;
  };
}