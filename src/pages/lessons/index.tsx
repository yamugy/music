import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import LessonList from '@/components/lesson/LessonList';
import LessonModal from '@/components/lesson/LessonModal';
import { Lesson, LessonFormData } from '@/types/lesson';

// 날짜 형식 변환 함수
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export default function LessonsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Partial<Lesson> | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmit = async (data: LessonFormData) => {
    try {
      const url = selectedLesson ? `/api/lessons/${selectedLesson.id}` : '/api/lessons';
      const method = selectedLesson ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `수업 ${selectedLesson ? '수정' : '등록'} 실패`);
      }

      await response.json(); // 응답 데이터 대기
      setRefreshTrigger(prev => prev + 1);
      setIsModalOpen(false);
      setSelectedLesson(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error:', error);
      alert(error.message || '수업 등록/수정 중 오류가 발생했습니다.');
    }
  };

  const handleEditClick = (lesson: Lesson) => {
    setSelectedLesson({
      ...lesson,
      date: formatDateForInput(lesson.date as string)  // 타입 단언 추가
    });
    setIsModalOpen(true);
  };

  return (
    <div className="px-1 sm:px-2 max-w-full mx-auto">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-pink-600">수업 관리</h1>
        <button
          onClick={() => {
            setSelectedLesson(null);
            setIsModalOpen(true);
          }}
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
        >
          새 수업 등록
        </button>
      </div>

      {/* 나머지 컨텐츠 */}
      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <div className="min-w-fit">
          <LessonList
            refreshTrigger={refreshTrigger}
            onEdit={handleEditClick}
          />
        </div>
      </div>

      <LessonModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLesson(null);
        }}
        onSubmit={handleSubmit}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
        lesson={selectedLesson}
      />
    </div>
  );
}