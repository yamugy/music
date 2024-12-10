import { useState, useEffect } from 'react';
import Modal from '@/components/common/Modal';
import { Lesson, LessonFormData } from '@/types/models';

const SUBJECTS = [
  '섹소폰', '클라리넷', '기타', '베이스', '드럼', '���래', '직접입력'
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${String(hour).padStart(2, '0')}:${minute}`;
});

interface Student {
  id: number;
  name: string;
  subject: string;  // 학생의 과목 정보 추가
}

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LessonFormData) => void;
  onSuccess?: () => void;
  initialDate?: Date;      // 추가
  lesson?: Partial<Lesson> | null;  // 타입 수정
}

export default function LessonModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  onSuccess,
  initialDate,    // 추가
  lesson 
}: LessonModalProps) {
  // 날짜 포맷 헬퍼 함수 수정
  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [formData, setFormData] = useState({
    studentId: lesson?.studentId || '',
    subject: lesson?.subject || SUBJECTS[0],
    customSubject: '', // 추가: 직접 입력용
    date: initialDate ? formatDate(initialDate) : formatDate(new Date()),  // 수정
    time: lesson?.time || '09:00',
    content: lesson?.content || ''
  });

  const [isCustomSubject, setIsCustomSubject] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetchStudents = async () => {
      try {
        const response = await fetch('/api/students');
        if (!response.ok) throw new Error('학생 목록을 불러오는데 실패했습니다.');
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchStudents();
  }, [isOpen]);

  useEffect(() => {
    if (lesson) {
      const formattedDate = lesson.date ? formatDate(lesson.date) : formatDate(new Date());
      const subjectValue = lesson.subject || SUBJECTS[0];
      
      setFormData({
        studentId: lesson.studentId || '',
        subject: subjectValue,
        customSubject: subjectValue && !SUBJECTS.includes(subjectValue) ? subjectValue : '',
        date: formattedDate,
        time: lesson.time || '09:00',
        content: lesson.content || ''
      });
      setIsCustomSubject(subjectValue ? !SUBJECTS.includes(subjectValue) : false);
    } else {
      setFormData({
        studentId: '',
        subject: SUBJECTS[0],
        customSubject: '',
        date: initialDate ? formatDate(initialDate) : formatDate(new Date()),
        time: '09:00',
        content: ''
      });
      setIsCustomSubject(false);
    }
  }, [lesson, initialDate]);

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setIsCustomSubject(value === '직접입력');
    setFormData(prev => ({
      ...prev,
      subject: value,
      customSubject: value === '직접입력' ? '' : prev.customSubject
    }));
  };

  // 학생 선택 시 과목 자동 설정
  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStudent = students.find(s => s.id === Number(e.target.value));
    if (selectedStudent) {
      const isCustom = !SUBJECTS.includes(selectedStudent.subject);
      setIsCustomSubject(isCustom);
      setFormData(prev => ({
        ...prev,
        studentId: e.target.value,
        subject: isCustom ? '직접입력' : selectedStudent.subject,
        customSubject: isCustom ? selectedStudent.subject : ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const submitData: LessonFormData = {
        studentId: Number(formData.studentId),
        subject: isCustomSubject ? formData.customSubject : formData.subject,
        date: formData.date,
        time: formData.time,
        content: formData.content
      };

      await onSubmit(submitData);
      if (onSuccess) {
        onSuccess(); // 성공 콜백 호출 보장
      }
      onClose();
    } catch (error) {
      console.error('Lesson error:', error);
      alert(error instanceof Error ? error.message : '수업 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={lesson ? "수업 수정" : "새 수업 등록"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">학생</label>
          <select
            value={formData.studentId}
            onChange={handleStudentChange}  // 변경된 핸들러 사용
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">학생 선택</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>{student.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">과목</label>
          <select
            value={formData.subject}
            onChange={handleSubjectChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required={!isCustomSubject}
          >
            {SUBJECTS.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
          {isCustomSubject && (
            <input
              type="text"
              value={formData.customSubject}
              onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="과목명 직접 입력"
              required
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">날짜</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">시간</label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              {TIME_OPTIONS.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">수업 내용</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded-md hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            {lesson ? '수정' : '등록'}
          </button>
        </div>
      </form>
    </Modal>
  );
}