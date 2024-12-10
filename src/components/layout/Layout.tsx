import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { NAVIGATION_ITEMS } from '@/lib/constants';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path === '/logout') {
      // 로그아웃 처리
      localStorage.removeItem('isLoggedIn');
      router.push('/');
      return;
    }
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-pink-500 p-4">
        <div className="flex space-x-4">
          {NAVIGATION_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`px-4 py-2 rounded-lg transition-colors
                ${item.path === '/logout' 
                  ? 'bg-lime-500 text-white hover:bg-lime-600' 
                  : router.pathname === item.path 
                    ? 'bg-pink-700 text-white' 
                    : 'text-white hover:bg-pink-600'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}