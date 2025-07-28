import React from 'react';
import { TrendingUp, Target, Calendar, Award } from 'lucide-react';
import { useGoals } from '../contexts/GoalContext';

export function ProgressView() {
  const { goals, tasks } = useGoals();

  const completedTasks = tasks.filter(t => t.status === 'completed');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  const goalProgress = goals.map(goal => ({
    ...goal,
    relatedTasks: tasks.filter(t => t.goalId === goal.id),
    completedTasks: tasks.filter(t => t.goalId === goal.id && t.status === 'completed')
  }));

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-500';
    if (progress >= 60) return 'from-blue-500 to-teal-500';
    if (progress >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vision': return '🏠';
      case 'long-term': return '🎯';
      case 'mid-term': return '📈';
      case 'short-term': return '⭐';
      default: return '📌';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">進捗分析</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">目標達成に向けた進捗状況を可視化して成長を実感しましょう</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">全体完了率</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{completionRate}%</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
              <div
                className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">アクティブ目標</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{goals.filter(g => g.status === 'active').length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Target className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">完了タスク</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{completedTasks.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">/ {totalTasks} タスク</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Award className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">継続日数</p>
              <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">24</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">日連続</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress Details */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">目標別進捗状況</h2>
        <div className="space-y-6">
          {goalProgress.map((goal) => (
            <div key={goal.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getTypeIcon(goal.type)}</span>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{goal.title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3">{goal.description}</p>
                  
                  <div className="grid sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">期間: </span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {new Date(goal.startDate).toLocaleDateString('ja-JP')} - {new Date(goal.endDate).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">関連タスク: </span>
                      <span className="text-gray-700 dark:text-gray-300">{goal.relatedTasks.length}件</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">完了タスク: </span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{goal.completedTasks.length}件</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">{goal.progress}%</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">進捗率</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">進捗</span>
                  <span className="text-gray-700 dark:text-gray-300">{goal.progress}% 完了</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div
                    className="bg-gray-900 dark:bg-white h-3 rounded-full transition-all duration-500"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {goal.relatedTasks.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">関連タスクの進捗:</div>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {goal.relatedTasks.slice(0, 4).map((task) => (
                      <div key={task.id} className="flex items-center space-x-2 text-sm">
                        <div className={`w-2 h-2 rounded-full ${
                          task.status === 'completed' ? 'bg-green-500' :
                          task.status === 'in-progress' ? 'bg-gray-600 dark:bg-gray-300' : 'bg-gray-400 dark:bg-gray-500'
                        }`} />
                        <span className={`truncate text-xs sm:text-sm ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                    {goal.relatedTasks.length > 4 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 col-span-2">
                        他 {goal.relatedTasks.length - 4} 件のタスク
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">週間進捗チャート</h2>
        <div className="h-48 sm:h-64 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-8 w-8 sm:h-12 sm:w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">進捗チャートは今後のアップデートで実装予定です</p>
          </div>
        </div>
      </div>
    </div>
  );
}