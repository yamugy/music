import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import LessonList from '@/components/lesson/LessonList';
import LessonModal from '@/components/lesson/LessonModal';
import { Lesson, LessonFormData } from '@/types/models';

export default function LessonsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleEdit = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    setIsModalOpen(true);
  };

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

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden px-0">
      <div className="flex flex-col space-y-8">
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
        <div className="w-full overflow-x-auto px-0">
          <div className="min-w-full">
            <LessonList 
              refreshTrigger={refreshTrigger}
              onEdit={handleEdit}
              className="min-w-full divide-y divide-gray-200"
            />
          </div>
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