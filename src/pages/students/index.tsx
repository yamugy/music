import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import StudentList from '@/components/student/StudentList'; // 경로 수정
import StudentModal from '@/components/student/StudentModal';
import { Student } from '@/types/models';

export default function StudentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden px-0">
      <div className="flex flex-col space-y-8">
        {/* 헤더 영역 */}
        <div className="flex items-center justify-between px-1"> {/* px-2에서 px-1로 변경 */}
          <h1 className="text-2xl font-bold text-pink-600">학생 관리</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors"
          >
            새 학생 등록
          </button>
        </div>

        {/* 테이블 컨테이너 */}
        <div className="w-full overflow-x-auto px-0"> {/* -mx-0를 제거하고 px-0 추가 */}
          <div className="min-w-full">
            <StudentList 
              onEdit={(student) => {
                setSelectedStudent(student);
                setIsModalOpen(true);
              }}
              refreshTrigger={refreshTrigger}
              className="min-w-full divide-y divide-gray-200"
            />
          </div>
        </div>
      </div>

      {/* 모달 */}
      {(isModalOpen || selectedStudent) && (
        <StudentModal 
          isOpen={isModalOpen || !!selectedStudent}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedStudent(null);
          }}
          student={selectedStudent}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}