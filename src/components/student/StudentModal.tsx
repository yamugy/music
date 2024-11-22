import { useState, useEffect, FormEvent } from 'react';

const SUBJECTS = ['섹소폰', '클라리넷', '기타', '베이스', '드럼', '키보드'];

type Student = {
  id?: number;  // 추가: 신규 등록 시에는 없을 수 있음
  name: string;
  phone: string;
  subject: string;
  note: string;
}

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onSuccess: () => void;
}

export default function StudentModal({ isOpen, onClose, student, onSuccess }: StudentModalProps) {
  const [formData, setFormData] = useState<Student>({
    name: '',
    phone: '',
    subject: '',
    note: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCustomSubject, setIsCustomSubject] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData(student);
      setIsCustomSubject(!SUBJECTS.includes(student.subject));
    } else {
      setFormData({ name: '', phone: '', subject: '', note: '' });
      setIsCustomSubject(false);
    }
  }, [student]);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    }
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = student?.id ? `/api/students/${student.id}` : '/api/students';
      const method = student ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error(student ? '수정 실패' : '등록 실패');

      onSuccess();
      onClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message || '오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{student ? '학생 정보 수정' : '새 학생 등록'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름 *</label>
            <input
              type="text"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">연락처 *</label>
            <input
              type="tel"
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              value={formData.phone}
              onChange={(e) => setFormData({ 
                ...formData, 
                phone: formatPhoneNumber(e.target.value)
              })}
              placeholder="010-0000-0000"
              maxLength={13}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">수업과목 *</label>
            <select
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              value={isCustomSubject ? '직접입력' : formData.subject}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '직접입력') {
                  setIsCustomSubject(true);
                  setFormData({ ...formData, subject: '' });
                } else {
                  setIsCustomSubject(false);
                  setFormData({ ...formData, subject: value });
                }
              }}
            >
              <option value="">선택해주세요</option>
              {SUBJECTS.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
              <option value="직접입력">직접입력</option>
            </select>
            {isCustomSubject && (
              <input
                type="text"
                required
                className="mt-2 block w-full px-3 py-2 border rounded-md"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="수업과목을 입력하세요"
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">메모</label>
            <textarea
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              rows={3}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
              disabled={loading}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md"
              disabled={loading}
            >
              {loading ? '처리중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}