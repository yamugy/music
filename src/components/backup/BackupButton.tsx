import { useState } from 'react';

export default function BackupButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBackup = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/backup');
      if (!response.ok) throw new Error('백업 생성에 실패했습니다.');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      // 마지막 백업 시간 저장
      localStorage.setItem('lastBackup', new Date().toISOString());
    } catch (error) {
      console.error('Backup error:', error);
      alert('백업 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleBackup}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? '백업 중...' : '데이터 백업'}
    </button>
  );
}