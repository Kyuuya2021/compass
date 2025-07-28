import React, { useState } from 'react';
import { Plus, Calendar, Flag, CheckCircle, Clock, Edit, Trash2, Target, User } from 'lucide-react';
import { useGoals, Task } from '../contexts/GoalContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { Checkbox } from './ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';

export function TaskManagement() {
  const { goals, tasks, addTask, updateTask, deleteTask } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goalId: '',
    dueDate: '',
    dueTime: '',
    estimatedDuration: 30,
    timeGranularity: 'daily' as Task['timeGranularity'],
    recurringType: 'none' as 'none' | 'daily' | 'weekly' | 'monthly' | 'custom',
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

  const handleSelectTask = (taskId: string, checked: boolean) => {
    const newSelected = new Set(selectedTasks);
    if (checked) {
      newSelected.add(taskId);
    } else {
      newSelected.delete(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(new Set(tasks.map(task => task.id)));
    } else {
      setSelectedTasks(new Set());
    }
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
      case 'pending': return 'text-gray-600 bg-gray-100 border-gray-200';
      case 'in-progress': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-100 border-green-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '未着手';
      case 'in-progress': return '進行中';
      case 'completed': return '完了';
      default: return '';
    }
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const allSelected = tasks.length > 0 && selectedTasks.size === tasks.length;
  const someSelected = selectedTasks.size > 0 && selectedTasks.size < tasks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">タスク管理</h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">目標達成に向けた日々のタスクを管理しましょう</p>
      </div>

      {/* Add Task Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>タスク追加</span>
        </button>
      </div>

      {/* Add/Edit Task Form */}
      {showAddForm && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingTask ? 'タスク編集' : '新規タスク追加'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                タイトル *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="タスクのタイトルを入力"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                関連目標
              </label>
              <select
                value={formData.goalId}
                onChange={(e) => setFormData({ ...formData, goalId: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">目標を選択</option>
                {goals.map((goal) => (
                  <option key={goal.id} value={goal.id}>
                    {goal.title}
                  </option>
                ))}
              </select>
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

      {/* Tasks Table */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>タスク</TableHead>
              <TableHead>関連目標</TableHead>
              <TableHead>期限</TableHead>
              <TableHead>優先度</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const relatedGoal = goals.find(g => g.id === task.goalId);
              const today = new Date();
              const dueDate = new Date(task.dueDate);
              dueDate.setHours(23, 59, 59, 999);
              today.setHours(0, 0, 0, 0);
              const isOverdue = dueDate < today && task.status !== 'completed';
              
              return (
                <TableRow key={task.id} className="has-[[data-state=checked]]:bg-muted/50">
                  <TableCell>
                    <Checkbox 
                      id={`task-${task.id}`}
                      checked={selectedTasks.has(task.id)}
                      onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                            task.status === 'completed'
                              ? 'border-gray-800 dark:border-gray-200 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                          }`}
                        >
                          {task.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        </button>
                        <span className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {task.title}
                        </span>
                        {isOverdue && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full">
                            期限超過
                          </span>
                        )}
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {relatedGoal ? (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{relatedGoal.title}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">なし</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">
                        {new Date(task.dueDate).toLocaleDateString('ja-JP')}
                        {task.dueTime && ` ${task.dueTime}`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">タスクがありません</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">新しいタスクを追加して始めましょう</p>
          </div>
        )}
      </div>

      {/* Selected Tasks Actions */}
      {selectedTasks.size > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              {selectedTasks.size}個のタスクが選択されています
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  selectedTasks.forEach(taskId => {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                      handleToggleComplete(task);
                    }
                  });
                  setSelectedTasks(new Set());
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                完了にする
              </button>
              <button
                onClick={() => setSelectedTasks(new Set())}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                選択解除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}