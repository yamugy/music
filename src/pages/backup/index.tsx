import { useState } from 'react';
import BackupButton from '@/components/backup/BackupButton';
import BackupStatus from '@/components/backup/BackupStatus';
import PrintButton from '@/components/print/PrintButton';
import PrintLayout from '@/components/print/PrintLayout';
import { formatPrintDate } from '@/utils/printUtils';
import PrintModal from '@/components/print/PrintModal';

export default function BackupPage() {
  const [isRestoring, setIsRestoring] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    
    if (!confirm('기존 데이터가 모두 삭제되고 백업 데이터로 대체됩니다. 계속하시겠습니까?')) {
      return;
    }

    setIsRestoring(true);
    try {
      const file = e.target.files[0];
      const backup = await file.text();
      
      const response = await fetch('/api/backup/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backup: JSON.parse(backup) })
      });

      if (!response.ok) throw new Error('백업 복원에 실패했습니다.');
      
      alert('백업이 성공적으로 복원되었습니다.');
      window.location.reload();
    } catch (error) {
      console.error('Restore error:', error);
      alert('백업 복원 중 오류가 발생했습니다.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        throw new Error('현재 비밀번호가 올바르지 않습니다.');
      }

      alert('비밀번호가 성공적으로 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">데이터 백업 관리</h1>
        <BackupStatus />
      </div>
      
      <div id="backup-print-content">
        <PrintLayout title="데이터 백업 관리 현황">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">백업 생성</h2>
              <div className="space-y-2">
                <BackupButton />
                <p className="text-sm text-gray-500 print-only">
                  마지막 백업 일시: {formatPrintDate(new Date())}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">백업 복원</h2>
              <div className="space-y-2 no-print">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleRestore}
                  disabled={isRestoring}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </PrintLayout>
      </div>

      {/* 프린트 버튼 위치 수정 */}
      <div className="mt-12 flex justify-center">
        <PrintButton 
          targetId="backup-print-content" 
          label="데이터 프린트"
          className="bg-pink-500 hover:bg-pink-600 px-6 py-2.5"
          onClick={() => setIsPrintModalOpen(true)}
        />
      </div>

      <PrintModal 
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* 비밀번호 변경 섹션 수정 */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-4">비밀번호 변경</h2>
        <form onSubmit={handlePasswordChange} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">현재 비밀번호</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm py-1.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm py-1.5"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm py-1.5"
              required
            />
          </div>
          {passwordError && (
            <div className="text-red-500 text-sm">{passwordError}</div>
          )}
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-1.5 px-4 rounded-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 text-sm"
          >
            변경
          </button>
        </form>
      </div>
    </div>
  );
}