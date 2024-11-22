import { useState, useEffect } from "react";
import Calendar from "@/components/calendar/Calendar";
import LessonModal from "@/components/lesson/LessonModal";
import { useRouter } from "next/router";
import { LessonFormData } from '@/types/models';

export default function Dashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [lessons, setLessons] = useState([]);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // 추가: 새로고침 트리거

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateClick = async (date: Date) => {
    try {
      const formattedDate = formatDate(date);
      const response = await fetch(`/api/lessons/search?date=${formattedDate}`);
      if (!response.ok) throw new Error('수업 정보 조회 실패');
      const data = await response.json();
      setLessons(data);
      setSelectedDate(new Date(date.getTime() + (9 * 60 * 60 * 1000)));
      setIsLessonModalOpen(true);
    } catch (error) {
      console.error('Error:', error);
      alert('수업 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleLessonSuccess = async () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      try {
        const response = await fetch(`/api/lessons/search?date=${formattedDate}`);
        if (!response.ok) throw new Error('수업 정보 조회 실패');
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const handleLessonSubmit = async (data: LessonFormData) => {
    try {
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          date: selectedDate ? formatDate(selectedDate) : data.date
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '수업 등록 실패');
      }
      
      setRefreshKey(prev => prev + 1); // 달력 새로고침 트리거
      handleLessonSuccess();
      setIsLessonModalOpen(false);
    } catch (err) {
      const error = err as Error;
      console.error('Error:', error);
      alert(error.message || '수업 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="px-1 sm:px-2 max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-pink-600 mb-8">대시보드</h1>  {/* mb-4에서 mb-8로 변경 */}
      
      <div className="overflow-x-auto -mx-1 sm:mx-0">
        <div className="min-w-fit">
          <Calendar onDateClick={handleDateClick} refreshTrigger={refreshKey} />
        </div>
      </div>

      {selectedDate && (
        <LessonModal
          isOpen={isLessonModalOpen}
          onClose={() => {
            setIsLessonModalOpen(false);
            setSelectedDate(null);
          }}
          onSubmit={handleLessonSubmit}
          onSuccess={handleLessonSuccess}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}