'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/income-sources', label: 'Income Sources', icon: '💰' },
  { href: '/transactions', label: 'Transactions', icon: '📋' },
  { href: '/categories', label: 'Categories', icon: '🏷️' },
  { href: '/reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-moyo-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-moyo-gray-700">
        <h1 className="text-xl font-bold text-moyo-blue-light">Moyo</h1>
        <p className="text-xs text-moyo-gray-400 mt-1">ExpenseTracker</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-moyo-blue text-white'
                  : 'text-moyo-gray-300 hover:bg-moyo-gray-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
