import React, { useState } from 'react';
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
  Sparkles,
  Brain,
  Settings,
  Database,
  ChevronDown,
  Download,
  Upload,
  Trash2,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

type View = 'landing' | 'onboarding' | 'dashboard' | 'goals' | 'tasks' | 'progress' | 'time' | 'future-vision' | 'vision-result' | 'value-analysis' | 'ideal-self-designer' | 'data-management' | 'profile-settings';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const navItems = [
    { 
      id: 'dashboard' as View, 
      label: 'ダッシュボード', 
      icon: LayoutDashboard,
      description: '今日の概要・統合ビュー'
    },
    { 
      id: 'goals' as View, 
      label: '進捗管理', 
      icon: Target,
      description: '目標設定・進捗追跡'
    },
    { 
      id: 'value-analysis' as View, 
      label: 'AI分析', 
      icon: Brain,
      description: '価値観・将来指針'
    },
  ];

  const settingsItems = [
    {
      id: 'data-management',
      label: 'データ管理',
      icon: Database,
      description: 'データのエクスポート・インポート',
      action: () => onViewChange('data-management' as View)
    },
    {
      id: 'profile',
      label: 'プロフィール設定',
      icon: User,
      description: 'ユーザー情報の編集',
      action: () => onViewChange('profile-settings' as View)
    },
    {
      id: 'security',
      label: 'セキュリティ',
      icon: Shield,
      description: 'パスワード変更・セキュリティ設定',
      action: () => console.log('セキュリティ設定')
    }
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
            
            {/* Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1.5 sm:p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center space-x-1"
                title="設定"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </button>
              
              {showSettings && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {settingsItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setShowSettings(false);
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                  <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button
                    onClick={() => {
                      logout();
                      setShowSettings(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>ログアウト</span>
                  </button>
                </div>
              )}
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
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors ${
                  currentView === item.id
                    ? 'bg-blue-50 border-t-2 border-blue-500 text-blue-700 dark:bg-blue-950 dark:border-blue-400 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
                title={item.description}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Click outside to close settings */}
      {showSettings && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettings(false)}
        />
      )}
    </nav>
  );
}