export interface Student {
    id: string;
    name: string;
}

export interface Lesson extends LessonFormData {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    student: Student;
    subject: string;
    time: string;
    content?: string;
}

export interface LessonFormData {
    title: string;
    description: string;
    date: Date | string;
    duration: number;
    studentId: string;
    teacherId: string;
}
