import React, { useState, useEffect, FC } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns';
import { ko } from 'date-fns/locale';

interface CalendarProps {
  onDateClick: (date: Date) => void;
  refreshTrigger?: number;  // 추가
}

interface CalendarLesson {
  id: number;
  date: string;
  time: string;
  student: {
    name: string;
  };
}

const Calendar: FC<CalendarProps> = ({ onDateClick, refreshTrigger }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState<Date[][]>([]);
  const [lessons, setLessons] = useState<CalendarLesson[]>([]);
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const generateCalendar = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const weeks: Date[][] = [];
    
    // 첫 주의 시작일 계산 (이전 달의 날짜 포함)
    const start = new Date(firstDay);
    start.setDate(start.getDate() - start.getDay());

    let currentWeek: Date[] = [];
    const end = new Date(lastDay);
    end.setDate(end.getDate() + (6 - end.getDay()));

    while (start <= end) {
      currentWeek.push(new Date(start));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      start.setDate(start.getDate() + 1);
    }

    setCalendar(weeks);
  };

  useEffect(() => {
    generateCalendar(currentDate);
  }, [currentDate]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch(
          `/api/lessons/calendar?year=${currentDate.getFullYear()}&month=${currentDate.getMonth() + 1}`
        );
        if (!response.ok) throw new Error('수업 정보를 불러오는데 실패했습니다.');
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Calendar error:', error);
      }
    };

    fetchLessons();
  }, [currentDate, refreshTrigger]); // refreshTrigger 의존성 추가 확인

  const getLessonsByDate = (date: Date) => {
    return lessons.filter(lesson => 
      new Date(lesson.date).toDateString() === date.toDateString()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderLessonInfo = (date: Date) => {
    const dayLessons = getLessonsByDate(date);
    
    return (
      <div className="min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 cursor-pointer" onClick={() => onDateClick(date)}>
        <div className={`text-xs sm:text-sm ${
          date.toDateString() === new Date().toDateString() ? 'font-bold text-pink-600' : ''
        }`}>
          {date.getDate()}
        </div>
        <div className="mt-1 space-y-1">
          {dayLessons.map(lesson => (
            <div 
              key={lesson.id}
              className="relative group"
            >
              <div className="text-[10px] sm:text-xs p-0.5 sm:p-1 bg-pink-50 rounded border border-pink-100">
                {lesson.time.split(' ')[0]} {lesson.student.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6"> {/* mb-2에서 mb-6으로 수정 */}
        <button
          onClick={handlePrevMonth}
          className="px-2 py-1 sm:px-4 sm:py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-xs sm:text-base"
        >
          이전달
        </button>
        <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
          {format(currentDate, 'yyyy년 M월')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-2 py-1 sm:px-4 sm:py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-200 transition-colors text-xs sm:text-base"
        >
          다음달
        </button>
      </div>

      <div className="w-full">
        <div className="min-w-full">
          <div className="grid grid-cols-7 border-b border-t border-gray-200">
            {weekDays.map((day) => (
              <div key={day} className="text-center py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-730 border-r">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendar.map((week, weekIndex) => (
              week.map((date, dateIndex) => (
                <div
                  key={`${weekIndex}-${dateIndex}`}
                  className={`
                    relative border-b border-r
                    min-h-[80px] sm:min-h-[120px]
                    ${date.getMonth() === currentDate.getMonth() ? 'bg-white' : 'bg-gray-50'}
                  `}
                >
                  {renderLessonInfo(date)}
                </div>
              ))
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;