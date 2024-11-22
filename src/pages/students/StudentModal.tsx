import { useState, useEffect } from 'react';

export default function StudentModal({ isOpen, onClose, student }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    subject: '',
  });

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
  }, [student]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{student ? '학생 정보 수정' : '새 학생 등록'}</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          {/* 추가 필드들 */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}