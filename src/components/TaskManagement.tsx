import React, { useState } from 'react';
import { Plus, Calendar, Flag, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { useGoals, Task } from '../contexts/GoalContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';

export function TaskManagement() {
  const { goals, tasks, addTask, updateTask, deleteTask } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalId: '',
    dueDate: '',
    dueTime: '',
    estimatedDuration: 30,
    timeGranularity: 'daily' as Task['timeGranularity'],
    recurringType: 'none' as 'none' | 'daily' | 'weekly' | 'monthly',
    recurringFrequency: 1,
    recurringDays: [] as number[],
    priority: 'medium' as Task['priority']
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      goalId: '',
      dueDate: '',
      dueTime: '',
      estimatedDuration: 30,
      timeGranularity: 'daily',
      recurringType: 'none',
      recurringFrequency: 1,
      recurringDays: [],
      priority: 'medium'
    });
    setShowAddForm(false);
    setEditingTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      ...formData,
      status: 'pending' as const,
      recurringPattern: formData.recurringType !== 'none' ? {
        type: formData.recurringType,
        frequency: formData.recurringFrequency,
        daysOfWeek: formData.recurringDays.length > 0 ? formData.recurringDays : undefined
      } : undefined,
      scheduledStart: formData.dueTime ? `${formData.dueDate}T${formData.dueTime}:00` : undefined,
      scheduledEnd: formData.dueTime && formData.estimatedDuration ? 
        new Date(new Date(`${formData.dueDate}T${formData.dueTime}:00`).getTime() + formData.estimatedDuration * 60000).toISOString() : undefined
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    
    resetForm();
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      goalId: task.goalId,
      dueDate: task.dueDate,
      dueTime: task.dueTime || '',
      estimatedDuration: task.estimatedDuration || 30,
      timeGranularity: task.timeGranularity,
      recurringType: task.recurringPattern?.type || 'none',
      recurringFrequency: task.recurringPattern?.frequency || 1,
      recurringDays: task.recurringPattern?.daysOfWeek || [],
      priority: task.priority
    });
    setShowAddForm(true);
  };

  const handleToggleComplete = (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTask(task.id, { 
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return '高優先度';
      case 'medium': return '中優先度';
      case 'low': return '低優先度';
      default: return '';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      case 'in-progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'pending': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '完了';
      case 'in-progress': return '進行中';
      case 'pending': return '未着手';
      default: return '';
    }
  };

  const goalOptions = goals.filter(g => g.level >= 2); // Allow tasks to be linked to mid-term goals or higher

  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    completed: tasks.filter(t => t.status === 'completed')
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">タスク管理</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">目標達成に向けた日々のタスクを管理しましょう</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>タスク</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingTask ? 'タスクを編集' : '新しいタスクを追加'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  タスクタイトル *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="具体的で実行可能なタスクを入力"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  関連する目標 *
                </label>
                <select
                  value={formData.goalId}
                  onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">目標を選択してください</option>
                  {goalOptions.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                説明
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="タスクの詳細や実行方法を記入"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  期限 *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  優先度 *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="high">高優先度</option>
                  <option value="medium">中優先度</option>
                  <option value="low">低優先度</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors order-2 sm:order-1"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors order-1 sm:order-2"
              >
                {editingTask ? '更新' : '追加'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:space-y-0">
        {Object.entries(groupedTasks).map(([status, taskList]) => (
          <div key={status}>
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-3 h-3 rounded-full ${
                status === 'pending' ? 'bg-gray-400' :
                status === 'in-progress' ? 'bg-gray-600 dark:bg-gray-300' : 'bg-gray-800 dark:bg-gray-200'
              }`} />
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {getStatusLabel(status)} ({taskList.length})
              </h2>
            </div>

            <div className="space-y-4">
              {taskList.map((task) => {
                const relatedGoal = goals.find(g => g.id === task.goalId);
                const today = new Date();
                const dueDate = new Date(task.dueDate);
                // Set time to end of day for due date comparison
                dueDate.setHours(23, 59, 59, 999);
                today.setHours(0, 0, 0, 0);
                const isOverdue = dueDate < today && task.status !== 'completed';
                
                return (
                  <div key={task.id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-4 hover:shadow-md transition-shadow touch-manipulation ${
                    isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border whitespace-nowrap ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          {isOverdue && (
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600 border border-red-200 whitespace-nowrap">
                              期限超過
                            </span>
                          )}
                        </div>
                        <h3 className={`font-semibold mb-1 text-sm sm:text-base break-words ${task.status === 'completed' ? 'text-gray-500 dark:text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-2 break-words">{task.description}</p>
                        )}
                        
                        {/* Breadcrumb */}
                        {relatedGoal && (
                          <BreadcrumbNavigation goalId={task.goalId} currentTask={task.title} />
                        )}
                      </div>
                      <button
                        onClick={() => handleToggleComplete(task)}
                        className={`w-8 h-8 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 ml-2 ${
                          task.status === 'completed'
                            ? 'border-gray-800 dark:border-gray-200 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                            : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {task.status === 'completed' && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">
                          {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                          {task.dueTime && ` ${task.dueTime}`}
                        </span>
                      </div>
                      {task.completedAt && (
                        <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                          <CheckCircle className="h-3 w-3" />
                          <span className="text-xs">
                            {new Date(task.completedAt).toLocaleDateString('ja-JP')}完了
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors touch-manipulation"
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors touch-manipulation"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {taskList.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm">
                    {status === 'pending' ? '未着手のタスクはありません' :
                     status === 'in-progress' ? '進行中のタスクはありません' :
                     '完了したタスクはありません'}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}