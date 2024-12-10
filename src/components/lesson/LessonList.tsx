import { Lesson } from '@/types/models';
import { BaseListProps } from '@/types/common';
import { useState, useEffect } from 'react';

// LessonListProps를 BaseListProps에서 확장
interface LessonListProps extends BaseListProps {
  onEdit: (lesson: Lesson) => void;
}

const LessonList: React.FC<LessonListProps> = ({ refreshTrigger, onEdit, className }) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'student' | 'time'>('student'); // 정렬 옵션 추가
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // 정렬 순서 추가

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await fetch('/api/lessons');
        if (!response.ok) throw new Error('수업 목록을 불러오는데 실패했습니다.');
        const data = await response.json();
        setLessons(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLessons();
  }, [refreshTrigger]);

  const handleDelete = async (lessonId: number) => {
    if (!confirm('정말 이 수업을 삭제하시겠습니까?')) return;

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('수업 삭제에 실패했습니다.');
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
    } catch (error) {
      console.error('Delete error:', error);
      alert('수업 삭제 중 오류가 발생했습니다.');
    }
  };

  // 학생별로 수업을 그룹화하는 함수
  const groupByStudent = (lessonList: Lesson[]) => {
    // 1. 학생별로 그룹화
    const grouped = lessonList.reduce((acc, lesson) => {
      const studentName = lesson.student.name;
      if (!acc[studentName]) {
        acc[studentName] = [];
      }
      acc[studentName].push(lesson);
      return acc;
    }, {} as Record<string, Lesson[]>);

    // 2. 각 학생의 수업을 날짜와 시간순으로 정렬
    Object.values(grouped).forEach(studentLessons => {
      studentLessons.sort((a, b) => {
        // 날짜 비교
        const dateComparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        // 날짜가 같으면 시간으로 비교
        if (dateComparison === 0) {
          return a.time.localeCompare(b.time);
        }
        return dateComparison;
      });
    });

    // 3. 학생 이름순으로 정렬된 객체 반환
    return Object.fromEntries(
      Object.entries(grouped).sort((a, b) => 
        sortOrder === 'asc' 
          ? a[0].localeCompare(b[0])
          : b[0].localeCompare(a[0])
      )
    );
  };

  // 정렬된 수업 목록을 반환하는 함수
  const getSortedLessons = () => {
    return [...lessons].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return sortOrder === 'asc' 
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'student':
          return sortOrder === 'asc'
            ? a.student.name.localeCompare(b.student.name)
            : b.student.name.localeCompare(a.student.name);
        case 'time':
          return sortOrder === 'asc'
            ? a.time.localeCompare(b.time)
            : b.time.localeCompare(a.time);
        default:
          return 0;
      }
    });
  };

  // 날짜 포맷 헬퍼 함수 수정
  const formatDate = (date: Date | string): string => {
    const d = date instanceof Date ? date : new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  if (isLoading) return <div className="text-center py-4">로딩 중...</div>;
  if (lessons.length === 0) return <div className="text-center py-4">등록된 수업이 없습니다.</div>;

  const sortedLessons = getSortedLessons();
  const groupedLessons = sortBy === 'student' ? groupByStudent(sortedLessons) : null;

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-end gap-2 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'date' | 'student' | 'time')}
          className="px-3 py-2 border rounded-md shadow-sm text-sm"
        >
          <option value="student">학생순</option>
          <option value="date">날짜순</option>
          <option value="time">시간순</option>
        </select>
        <button
          onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          className="px-3 py-2 border rounded-md shadow-sm bg-white text-sm hover:bg-gray-50"
        >
          {sortOrder === 'asc' ? '오름차순 ↑' : '내림차순 ↓'}
        </button>
      </div>

      {sortBy === 'student' ? (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  학생명
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  과목
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  수업내용
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(() => {
                let currentStudent = '';
                return sortedLessons.map((lesson, index) => {
                  const isNewStudent = currentStudent !== lesson.student.name;
                  if (isNewStudent) {
                    currentStudent = lesson.student.name;
                  }
                  return (
                    <tr 
                      key={lesson.id} 
                      className={`hover:bg-gray-50 ${
                        isNewStudent ? 'border-t-2 border-pink-100' : ''
                      }`}
                    >
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {isNewStudent ? (
                          <div className="font-bold text-base text-gray-900 bg-pink-50 -mx-4 px-4 py-2">
                            {lesson.student.name}
                          </div>
                        ) : (
                          <div className="text-transparent">
                            {lesson.student.name}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {lesson.subject}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {formatDate(lesson.date)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-900">
                        {lesson.time}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500 max-w-xs truncate">
                        {lesson.content || '-'}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onEdit(lesson)}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(lesson.id)}
                            className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded hover:bg-pink-200"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
          </table>
        </div>
      ) : (
        // 기존의 날짜순 테이블 뷰
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  학생명
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  과목
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  날짜
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  수업내용
                </th>
                <th className="px-4 py-3 text-center text-sm font-bold text-gray-900 uppercase tracking-wider">
                  관리
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedLessons.map((lesson) => (
                <tr key={lesson.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center text-sm font-semibold text-gray-900 bg-pink-50">
                    {lesson.student.name}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900">
                    {lesson.subject}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900">
                    {formatDate(lesson.date)}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-900">
                    {lesson.time}
                  </td>
                  <td className="px-4 py-3 text-center text-sm text-gray-500 max-w-xs truncate">
                    {lesson.content || '-'}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(lesson)}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(lesson.id)}
                        className="px-2 py-1 text-xs bg-pink-100 text-pink-600 rounded hover:bg-pink-200"
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LessonList;