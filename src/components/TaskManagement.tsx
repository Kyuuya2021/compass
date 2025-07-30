import React, { useState } from 'react';
import { Plus, Edit, Trash2, CheckSquare, Calendar, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useGoals, Task } from '../contexts/GoalContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';

export function TaskManagement() {
  const { tasks, goals, addTask, updateTask, deleteTask } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // 繰り返しタスクのインスタンスを生成する関数
  const generateRecurringTaskInstances = (task: Task) => {
    if (!task.recurrence || task.recurrence.type === 'none') {
      return [task];
    }

    const instances = [];
    const startDate = new Date(task.dueDate);
    const endDate = task.recurrence.endDate ? new Date(task.recurrence.endDate) : null;
    const maxOccurrences = task.recurrence.maxOccurrences || 0;
    let currentDate = new Date(startDate);
    let occurrenceCount = 0;

    while (true) {
      // 終了条件のチェック
      if (endDate && currentDate > endDate) break;
      if (maxOccurrences > 0 && occurrenceCount >= maxOccurrences) break;

      // 日付の計算
      let shouldInclude = false;
      switch (task.recurrence.type) {
        case 'daily':
          shouldInclude = true;
          currentDate.setDate(currentDate.getDate() + (task.recurrence.interval || 1));
          break;
        
        case 'weekly':
          if (task.recurrence.daysOfWeek && task.recurrence.daysOfWeek.length > 0) {
            // 指定された曜日のみ
            const currentDayOfWeek = currentDate.getDay();
            if (task.recurrence.daysOfWeek.includes(currentDayOfWeek)) {
              shouldInclude = true;
            }
          } else {
            // 開始日の曜日で繰り返し
            shouldInclude = true;
          }
          currentDate.setDate(currentDate.getDate() + 7 * (task.recurrence.interval || 1));
          break;
        
        case 'monthly':
          const currentDay = currentDate.getDate();
          const targetDay = task.recurrence.dayOfMonth || 1;
          if (currentDay === targetDay) {
            shouldInclude = true;
          }
          currentDate.setMonth(currentDate.getMonth() + (task.recurrence.interval || 1));
          break;
        
        default:
          shouldInclude = true;
          break;
      }

      if (shouldInclude) {
        // 時間の設定
        let taskTime = task.dueTime;
        if (task.recurrence.type === 'weekly' && task.recurrence.daysOfWeek) {
          const dayOfWeek = new Date(currentDate).getDay();
          const weeklyTime = (task as any).weeklyTimes?.[dayOfWeek];
          if (weeklyTime) {
            taskTime = weeklyTime;
          }
        }

        instances.push({
          ...task,
          id: `${task.id}_${occurrenceCount}`,
          dueDate: currentDate.toISOString().split('T')[0],
          dueTime: taskTime,
          originalTaskId: task.id,
          instanceNumber: occurrenceCount + 1
        });
        occurrenceCount++;
      } else {
        // 次の日付に進む
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // 無限ループ防止
      if (occurrenceCount > 1000) break;
    }

    return instances;
  };

  // 繰り返しタスクを含むタスク一覧を取得
  const getTasksWithInstances = () => {
    const allInstances: (Task & { originalTaskId?: string; instanceNumber?: number })[] = [];
    
    tasks.forEach(task => {
      const instances = generateRecurringTaskInstances(task);
      allInstances.push(...instances);
    });
    
    return allInstances;
  };

  const allTasks = getTasksWithInstances();

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

  const generateVisionConnection = (task: Omit<Task, 'id'>, goalTitle?: string) => {
    // 簡単なルールベースでビジョン接続を生成
    const connections = {
      '英語': {
        coreVisionRelevance: '国際的なコミュニケーション能力向上',
        valueAlignment: ['成長・学習', '社会貢献'],
        impactScore: 7.0,
        whyStatement: 'グローバルに活躍するエンジニアとして、英語でのコミュニケーション能力は必須スキル'
      },
      'プログラミング': {
        coreVisionRelevance: '革新的ソリューション提供力の強化',
        valueAlignment: ['成長・学習', '創造・革新'],
        impactScore: 8.0,
        whyStatement: '最新技術を習得し、より効率的で革新的なソリューションを提供'
      },
      '運動': {
        coreVisionRelevance: '健康的で持続可能なライフスタイル',
        valueAlignment: ['自律・自由', '家族・関係'],
        impactScore: 6.5,
        whyStatement: '健康な体と心を維持し、長期的に理想を実現し続ける基盤作り'
      },
      '家族': {
        coreVisionRelevance: '家族との時間を大切にするライフスタイル',
        valueAlignment: ['家族・関係', '自律・自由'],
        impactScore: 9.0,
        whyStatement: '理想のワークライフバランスを実現し、大切な人との絆を深める'
      }
    };

    // タスクタイトルや説明からキーワードを検索
    const taskText = `${task.title} ${task.description}`.toLowerCase();
    
    for (const [keyword, connection] of Object.entries(connections)) {
      if (taskText.includes(keyword.toLowerCase())) {
        return connection;
      }
    }

    // デフォルト接続
    return {
      coreVisionRelevance: '理想の実現に向けた日々の積み重ね',
      valueAlignment: ['成長・学習'],
      impactScore: 5.0,
      whyStatement: '小さな一歩一歩が理想の未来への確実な前進となります'
    };
  };

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
      const goalTitle = goals.find(g => g.id === taskData.goalId)?.title;
      const visionConnection = generateVisionConnection(taskData, goalTitle);
      
      addTask({
        ...taskData,
        visionConnection
      });
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
      setSelectedTasks(new Set(allTasks.map(task => task.id)));
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

  const getGoalTitle = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.title : '未設定';
  };

  const getGoalType = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    return goal ? goal.type : '';
  };

  const getGoalTypeColor = (type: string) => {
    switch (type) {
      case 'vision': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800';
      case 'long-term': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
      case 'mid-term': return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:border-teal-800';
      case 'short-term': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getGoalTypeLabel = (type: string) => {
    switch (type) {
      case 'vision': return 'ビジョン';
      case 'long-term': return '長期目標';
      case 'mid-term': return '中期目標';
      case 'short-term': return '短期目標';
      default: return '';
    }
  };

  const groupedTasks = allTasks.reduce((acc, task) => {
    const status = task.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  const allSelected = allTasks.length > 0 && selectedTasks.size === allTasks.length;
  const someSelected = selectedTasks.size > 0 && selectedTasks.size < allTasks.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">タスク管理</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              目標達成に向けた日々のタスクを管理しましょう
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <span>総タスク数: {allTasks.length}</span>
              <span className="text-green-600">•</span>
              <span>完了: {allTasks.filter(t => t.status === 'completed').length}</span>
              <span className="text-blue-600">•</span>
              <span>繰り返し: {tasks.filter(t => t.recurrence && t.recurrence.type !== 'none').length}</span>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>タスク追加</span>
            </button>
          </div>
        </div>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">タスク一覧</h3>
            <div className="flex items-center space-x-2">
              {selectedTasks.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedTasks.size} 件選択中
                  </span>
                  <button
                    onClick={() => {
                      selectedTasks.forEach(taskId => {
                        const task = allTasks.find(t => t.id === taskId);
                        if (task) {
                          updateTask(task.id, { status: 'completed' });
                        }
                      });
                      setSelectedTasks(new Set());
                    }}
                    className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  >
                    一括完了
                  </button>
                  <button
                    onClick={() => setSelectedTasks(new Set())}
                    className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
                  >
                    選択解除
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-gray-50 dark:bg-gray-700/50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-semibold">タスク</TableHead>
              <TableHead className="font-semibold">関連目標</TableHead>
              <TableHead className="font-semibold">期限</TableHead>
              <TableHead className="font-semibold">優先度</TableHead>
              <TableHead className="font-semibold">ステータス</TableHead>
              <TableHead className="text-right font-semibold">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTasks.map((task) => {
              const relatedGoal = goals.find(g => g.id === task.goalId);
              const today = new Date();
              const dueDate = new Date(task.dueDate);
              dueDate.setHours(23, 59, 59, 999);
              today.setHours(0, 0, 0, 0);
              const isOverdue = dueDate < today && task.status !== 'completed';
              const isRecurringInstance = (task as any).originalTaskId && (task as any).instanceNumber;
              
              return (
                <TableRow key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <TableCell>
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={selectedTasks.has(task.id)} 
                      onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)} 
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => handleToggleComplete(task)} className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                          task.status === 'completed'
                            ? 'border-green-600 bg-green-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20'
                        }`}>
                          {task.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium text-sm ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                              {task.title}
                            </span>
                            {isRecurringInstance && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
                                {(task as any).instanceNumber}回目
                              </span>
                            )}
                          </div>
                          {isOverdue && (
                            <span className="ml-2 inline-block px-2 py-0.5 text-xs bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-full">
                              期限超過
                            </span>
                          )}
                        </div>
                      </div>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-8 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {relatedGoal ? (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Target className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{relatedGoal.title}</span>
                        </div>
                        <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${getGoalTypeColor(relatedGoal.type)}`}>
                          {getGoalTypeLabel(relatedGoal.type)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">未設定</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className={`text-sm ${isOverdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                        {task.dueDate}
                      </span>
                      {task.dueTime && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <button onClick={() => handleEdit(task)} className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {allTasks.length === 0 && (
          <div className="text-center py-12">
            <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">タスクがありません</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              最初のタスクを作成して、目標達成に向けた一歩を踏み出しましょう
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <Plus className="h-4 w-4 mr-2 inline" />
              タスクを追加
            </button>
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
                    const task = allTasks.find(t => t.id === taskId);
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