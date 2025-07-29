import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Home, 
  ChevronRight,
  Compass,
  Heart,
  Star,
  Edit,
  Plus,
  BarChart3,
  ArrowUp,
  Brain,
  Zap,
  Users,
  Globe
} from 'lucide-react';
import { useGoals } from '../contexts/GoalContext';
import { useAuth } from '../contexts/AuthContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';

interface VisionData {
  coreVision: string;
  values: Array<{
    name: string;
    description: string;
    score: number;
    trend: number;
    icon: string;
  }>;
  idealDay: {
    morning: string;
    afternoon: string;
    evening: string;
  };
  providedValue: string[];
  lifestyle: string[];
  monthlyGrowth: Array<{
    date: string;
    achievement: string;
    impact: number;
  }>;
}

export function Dashboard() {
  const { goals, tasks, getTodaysTasks, updateTask, addTask } = useGoals();
  const { user } = useAuth();
  const todaysTasks = getTodaysTasks();
  const activeGoals = goals.filter(g => g.status === 'active');
  const completedTasks = todaysTasks.filter(t => t.status === 'completed');
  const completionRate = todaysTasks.length > 0 ? Math.round((completedTasks.length / todaysTasks.length) * 100) : 0;

  const [visionData, setVisionData] = useState<VisionData | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    goalId: '',
    dueTime: '',
    estimatedDuration: 30,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const handleCreateTask = () => {
    if (taskFormData.title.trim()) {
      addTask({
        title: taskFormData.title,
        description: taskFormData.description,
        goalId: taskFormData.goalId || activeGoals[0]?.id || '',
        dueDate: new Date().toISOString(),
        dueTime: taskFormData.dueTime,
        estimatedDuration: taskFormData.estimatedDuration,
        priority: taskFormData.priority,
        status: 'pending',
        timeGranularity: 'daily'
      });
      setTaskFormData({
        title: '',
        description: '',
        goalId: '',
        dueTime: '',
        estimatedDuration: 30,
        priority: 'medium'
      });
      setShowTaskForm(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '';
    }
  };

  const getValueIcon = (value: string) => {
    switch (value) {
      case '成長・学習': return '🌱';
      case '社会貢献': return '🤝';
      case '自律・自由': return '🏃';
      case '家族・関係': return '👨‍👩‍👧‍👦';
      case '創造・革新': return '💡';
      default: return '💎';
    }
  };

  useEffect(() => {
    // Mock vision data - in real app, this would come from the onboarding results
    setVisionData({
      coreVision: "技術力と創造性を通じてビジネス課題解決に革新的ソリューションを提供し、自由度の高い働き方で家族との時間も大切にする",
      values: [
        {
          name: "成長・学習",
          description: "常に新しい技術や知識に触れ、昨日の自分を超える",
          score: 80,
          trend: 5,
          icon: "🌱"
        },
        {
          name: "社会貢献",
          description: "技術を通じて人々の課題を解決し、社会をより良くする",
          score: 65,
          trend: -2,
          icon: "🤝"
        },
        {
          name: "自律・自由",
          description: "自分らしい働き方で創造性を最大限に発揮する",
          score: 52,
          trend: 8,
          icon: "🏃"
        },
        {
          name: "家族・関係",
          description: "大切な人との時間を大切にし、深い絆を築く",
          score: 78,
          trend: 3,
          icon: "👨‍👩‍👧‍👦"
        }
      ],
      idealDay: {
        morning: "家族と朝食、軽い運動",
        afternoon: "創造的な開発業務、チームとの協働",
        evening: "学習・自己投資時間、家族時間"
      },
      providedValue: [
        "中小企業のDX推進支援",
        "若手エンジニアのメンタリング",
        "オープンソース貢献"
      ],
      lifestyle: [
        "リモートワーク中心",
        "月1回の海外ワーケーション",
        "地域コミュニティ活動参加"
      ],
      monthlyGrowth: [
        {
          date: "7日前",
          achievement: "React基礎コース完了",
          impact: 5
        },
        {
          date: "14日前",
          achievement: "英語プレゼン成功",
          impact: 8
        },
        {
          date: "21日前",
          achievement: "運動習慣21日継続達成",
          impact: 12
        }
      ]
    });
  }, []);

  const overallRealization = visionData ? 
    Math.round(visionData.values.reduce((sum, v) => sum + v.score, 0) / visionData.values.length) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user?.name || 'ユーザー'}さんの人生コンパス
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
          今日も理想の自分に向かって一歩前進しましょう
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Core Vision & Values */}
        <div className="lg:col-span-2 space-y-6">
          {/* Core Vision */}
          {visionData && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Compass className="h-5 w-5" />
                    <span>あなたのコアビジョン</span>
                  </h2>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {visionData.coreVision}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>設定から 128日 経過</span>
                  <span className="flex items-center space-x-1">
                    <span>総合実現度: {overallRealization}%</span>
                    <ArrowUp className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">(+3%今月)</span>
                  </span>
                </div>
              </div>

              {/* Values Progress */}
              <div className="p-4 sm:p-6">
                <h3 className="text-base font-medium text-gray-900 dark:text-white mb-4">価値観進捗</h3>
                <div className="space-y-4">
                  {visionData.values.map((value, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{value.icon}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {value.name}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {value.score}%
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            value.trend > 0 ? 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900' :
                            value.trend < 0 ? 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900' :
                            'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
                          }`}>
                            {value.trend > 0 ? '↑' : value.trend < 0 ? '↓' : '→'} {Math.abs(value.trend)}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${value.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Today's Focus Theme */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
                <Target className="h-5 w-5" />
                <span>今日の重点テーマ</span>
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  「技術スキル向上」
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  理想との繋がり: 革新的ソリューション提供力の強化
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  推奨集中時間: 午前 9:00-11:00 (あなたの集中ピーク)
                </p>
              </div>
            </div>
          </div>

          {/* Today's Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>今日のアクション</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    完了率: {completionRate}% ({completedTasks.length}/{todaysTasks.length})
                  </span>
                  <button 
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>タスク追加</span>
                  </button>
                </div>
              </div>

              {todaysTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 mb-2">今日のタスクはありません</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    新しいタスクを追加して目標に向けて進みましょう
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <button
                        onClick={() => handleCompleteTask(task.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          task.status === 'completed'
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${
                          task.status === 'completed' 
                            ? 'text-gray-500 dark:text-gray-400 line-through' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {getPriorityLabel(task.priority)}
                        </span>
                        {task.dueTime && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {task.dueTime}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Task Form */}
              {showTaskForm && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="タスク名"
                      value={taskFormData.title}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <textarea
                      placeholder="詳細（任意）"
                      value={taskFormData.description}
                      onChange={(e) => setTaskFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={2}
                    />
                    <div className="flex space-x-2">
                      <select
                        value={taskFormData.priority}
                        onChange={(e) => setTaskFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="low">優先度: 低</option>
                        <option value="medium">優先度: 中</option>
                        <option value="high">優先度: 高</option>
                      </select>
                      <input
                        type="time"
                        value={taskFormData.dueTime}
                        onChange={(e) => setTaskFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCreateTask}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        追加
                      </button>
                      <button
                        onClick={() => setShowTaskForm(false)}
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg transition-colors"
                      >
                        キャンセル
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Ideal Self */}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">今日のタスク</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{todaysTasks.length}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">アクティブ目標</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <Target className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">完了率</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400">継続日数</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">24日</p>
                </div>
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Ideal Self */}
          {visionData && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2 mb-4">
                  <Star className="h-5 w-5" />
                  <span>あなたの理想像</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      理想の一日 (5年後)
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      <div>• 朝: {visionData.idealDay.morning}</div>
                      <div>• 午後: {visionData.idealDay.afternoon}</div>
                      <div>• 夕方: {visionData.idealDay.evening}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      提供している価値
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {visionData.providedValue.map((value, index) => (
                        <div key={index}>• {value}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      生活スタイル
                    </h3>
                    <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                      {visionData.lifestyle.map((style, index) => (
                        <div key={index}>• {style}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}