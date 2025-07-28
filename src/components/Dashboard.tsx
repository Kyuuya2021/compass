import React from 'react';
import { Calendar, Target, CheckCircle, Clock, TrendingUp, Home, ChevronRight } from 'lucide-react';
import { useGoals } from '../contexts/GoalContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';

export function Dashboard() {
  const { goals, tasks, getTodaysTasks, updateTask } = useGoals();
  const todaysTasks = getTodaysTasks();
  const activeGoals = goals.filter(g => g.status === 'active');

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">ダッシュボード</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">今日も理想の自分に向かって一歩前進しましょう</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">今日のタスク</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{todaysTasks.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">アクティブ目標</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{activeGoals.length}</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <Target className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">完了率</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">67%</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">継続日数</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">24日</p>
            </div>
            <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Today's Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Clock className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span>今日のタスク</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => {
                  const taskGoal = goals.find(g => g.id === task.goalId);
                  return (
                    <div key={task.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:shadow-md transition-shadow touch-manipulation bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm sm:text-base break-words">{task.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 break-words">{task.description}</p>
                          
                          {/* Time Info */}
                          <div className="flex items-center space-x-2 mb-2 text-xs text-gray-500 dark:text-gray-400">
                            {task.dueTime && (
                              <span className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{task.dueTime}</span>
                              </span>
                            )}
                            {task.estimatedDuration && (
                              <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                                {task.estimatedDuration}分
                              </span>
                            )}
                          </div>

                          {/* Breadcrumb for task */}
                          {taskGoal && (
                            <BreadcrumbNavigation goalId={task.goalId} currentTask={task.title} />
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center justify-center flex-shrink-0 touch-manipulation"
                          >
                            <CheckCircle className="h-4 w-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">今日のタスクはありません</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">新しいタスクを追加して目標に向けて進みましょう</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Target className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                <span>目標進捗</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {activeGoals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm break-words flex-1 mr-2">{goal.title}</h3>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vision Reminder */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-900 dark:bg-white rounded-xl flex items-center justify-center flex-shrink-0">
                <Home className="h-5 w-5 text-white dark:text-gray-900" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">あなたのビジョン</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  グローバルに活躍するエンジニアになる
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  今日のタスクが、この理想へとつながっています
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}