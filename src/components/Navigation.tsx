import React from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  Target, 
  CheckSquare, 
  Clock,
  TrendingUp, 
  LogOut,
  User,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

type View = 'dashboard' | 'goals' | 'tasks' | 'progress' | 'future-vision' | 'future-vision-dashboard' | 'value-analysis';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard' as View, label: 'ダッシュボード', icon: LayoutDashboard },
    { id: 'goals' as View, label: '目標管理', icon: Target },
    { id: 'tasks' as View, label: 'タスク管理', icon: CheckSquare },
    { id: 'progress' as View, label: '進捗分析', icon: TrendingUp },
    { id: 'future-vision' as View, label: '将来指針', icon: Sparkles },
    { id: 'value-analysis' as View, label: '価値観分析', icon: Target },
    { id: 'future-vision-dashboard' as View, label: '指針ダッシュボード', icon: Compass },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-50 transition-colors duration-200">
      <div className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Compass className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900 dark:text-white" />
            <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Compass</span>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <User className="h-4 w-4" />
              <span>{user?.name}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={theme === 'light' ? 'ダークモード' : 'ライトモード'}
            >
              {theme === 'light' ? (
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-current relative">
                  <div className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-current rounded-full transform translate-x-0.5 -translate-y-0.5"></div>
                </div>
              ) : (
                <div className="h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-current"></div>
              )}
            </button>
            <button
              onClick={logout}
              className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              title="ログアウト"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex-1 py-2.5 px-1 text-xs font-medium transition-colors flex flex-col items-center space-y-1 min-h-[60px] ${
                  currentView === item.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] leading-tight text-center">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}