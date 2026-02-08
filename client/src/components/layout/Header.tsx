'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-moyo-gray-200 flex items-center justify-between px-6">
      <div />
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 text-sm text-moyo-gray-600 hover:text-moyo-gray-900"
        >
          <div className="w-8 h-8 bg-moyo-blue rounded-full flex items-center justify-center text-white font-medium text-sm">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="font-medium">{user?.username}</span>
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-moyo-gray-200 py-1 z-50">
            <div className="px-4 py-2 text-xs text-moyo-gray-500 border-b border-moyo-gray-100">
              {user?.email}
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-moyo-red hover:bg-moyo-gray-50"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
