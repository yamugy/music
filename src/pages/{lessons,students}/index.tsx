
import { useState } from 'react';
import LessonModal from '@/components/lesson/LessonModal';
import LessonList from '@/components/lesson/LessonList';

export default function LessonsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden">
      <div className="flex flex-col">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">수업 관리</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
          >
            새 수업 등록
          </button>
        </div>

        {/* 테이블 컨테이너 */}
        <div className="w-full overflow-x-auto">
          <div className="min-w-full border-x border-t border-gray-200">
            <LessonList 
              refreshTrigger={refreshTrigger}
              onEdit={setSelectedLesson}
              className="min-w-full divide-y divide-gray-200"
            />
          </div>
        </div>
      </div>

      {/* 모달 */}
      {(isModalOpen || selectedLesson) && (
        <LessonModal
          isOpen={true}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLesson(null);
          }}
          onSuccess={handleSuccess}
          lesson={selectedLesson}
        />
      )}
    </div>
  );
}