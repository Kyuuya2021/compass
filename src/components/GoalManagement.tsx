import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2, CheckSquare, BarChart3, Filter, Search, MoreVertical, Clock, AlertCircle, CheckCircle, Play, Pause, List, ChevronDown, X } from 'lucide-react';
import { useGoals, Goal } from '../contexts/GoalContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { TaskManagement } from './TaskManagement';
import { ProgressView } from './ProgressView';

type TabType = 'goals' | 'tasks' | 'progress';
type GoalStatus = 'active' | 'completed' | 'paused';
type GoalPriority = 'high' | 'medium' | 'low';

type TaskRecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
type TaskRecurrencePattern = {
  type: TaskRecurrenceType;
  interval?: number; // 間隔（例：2週間ごと）
  daysOfWeek?: number[]; // 週の何曜日か（0=日曜日）
  dayOfMonth?: number; // 月の何日か
  endDate?: string; // 繰り返し終了日
  maxOccurrences?: number; // 最大繰り返し回数
};

export function GoalManagement() {
  const { goals, tasks, addGoal, updateGoal, deleteGoal, addTask } = useGoals();
  const [activeTab, setActiveTab] = useState<TabType>('goals');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<GoalStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'progress' | 'priority' | 'startDate'>('progress');
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedGoalForTask, setSelectedGoalForTask] = useState<Goal | null>(null);
  const [showGoalDetail, setShowGoalDetail] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const tabs = [
    { id: 'goals' as TabType, label: '目標・進捗', icon: Target },
    { id: 'tasks' as TabType, label: 'タスク管理', icon: CheckSquare },
    { id: 'progress' as TabType, label: '進捗分析', icon: BarChart3 },
  ];

  const getTaskCountForGoal = (goalId: string) => {
    return tasks.filter(task => task.goalId === goalId).length;
  };

  const getCompletedTaskCountForGoal = (goalId: string) => {
    return tasks.filter(task => task.goalId === goalId && task.status === 'completed').length;
  };

  // 繰り返しタスクを含むタスク一覧を取得
  const getTasksWithInstances = () => {
    const allInstances = [];
    
    tasks.forEach(task => {
      const instances = generateRecurringTaskInstances(task);
      allInstances.push(...instances);
    });
    
    return allInstances;
  };

  // 繰り返しタスクのインスタンスを生成する関数
  const generateRecurringTaskInstances = (task: any) => {
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
          const weeklyTime = task.weeklyTimes?.[dayOfWeek];
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

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parentId: '',
    startDate: '',
    endDate: '',
    type: 'mid-term' as Goal['type'],
    priority: 'medium' as GoalPriority,
    status: 'active' as GoalStatus
  });

  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    goalId: '',
    dueDate: '',
    dueTime: '',
    estimatedDuration: 30,
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in-progress' | 'completed',
    recurrence: {
      type: 'none' as TaskRecurrenceType,
      interval: 1,
      daysOfWeek: [],
      dayOfMonth: 1,
      endDate: '',
      maxOccurrences: 0
    } as TaskRecurrencePattern,
    weeklyTimes: {
      0: '', // 日曜日
      1: '', // 月曜日
      2: '', // 火曜日
      3: '', // 水曜日
      4: '', // 木曜日
      5: '', // 金曜日
      6: ''  // 土曜日
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      parentId: '',
      startDate: '',
      endDate: '',
      type: 'mid-term',
      priority: 'medium',
      status: 'active'
    });
    setShowAddForm(false);
    setEditingGoal(null);
  };

  const resetTaskForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      goalId: '',
      dueDate: '',
      dueTime: '',
      estimatedDuration: 30,
      priority: 'medium',
      status: 'pending',
      recurrence: {
        type: 'none',
        interval: 1,
        daysOfWeek: [],
        dayOfMonth: 1,
        endDate: '',
        maxOccurrences: 0
      },
      weeklyTimes: {
        0: '', // 日曜日
        1: '', // 月曜日
        2: '', // 火曜日
        3: '', // 水曜日
        4: '', // 木曜日
        5: '', // 金曜日
        6: ''  // 土曜日
      }
    });
    setShowTaskForm(false);
    setSelectedGoalForTask(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      updateGoal(editingGoal.id, {
        ...formData,
        level: formData.parentId ? goals.find(g => g.id === formData.parentId)!.level + 1 : 1
      });
    } else {
      addGoal({
        ...formData,
        level: formData.parentId ? goals.find(g => g.id === formData.parentId)!.level + 1 : 1,
        progress: 0,
        status: formData.status
      });
    }
    
    resetForm();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (taskFormData.title.trim() && selectedGoalForTask) {
      addTask({
        title: taskFormData.title,
        description: taskFormData.description,
        goalId: selectedGoalForTask.id,
        dueDate: taskFormData.dueDate || new Date().toISOString(),
        dueTime: taskFormData.dueTime,
        estimatedDuration: taskFormData.estimatedDuration,
        priority: taskFormData.priority,
        status: taskFormData.status,
        timeGranularity: 'daily',
        recurrence: taskFormData.recurrence
      });
      resetTaskForm();
    }
  };

  const handleCreateTaskFromGoal = (goal: Goal) => {
    setSelectedGoalForTask(goal);
    setTaskFormData({
      title: '',
      description: '',
      goalId: goal.id,
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '',
      estimatedDuration: 30,
      priority: 'medium',
      status: 'pending',
      recurrence: {
        type: 'none',
        interval: 1,
        daysOfWeek: [],
        dayOfMonth: 1,
        endDate: '',
        maxOccurrences: 0
      },
      weeklyTimes: {
        0: '', // 日曜日
        1: '', // 月曜日
        2: '', // 火曜日
        3: '', // 水曜日
        4: '', // 木曜日
        5: '', // 金曜日
        6: ''  // 土曜日
      }
    });
    setShowTaskForm(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      parentId: goal.parentId || '',
      startDate: goal.startDate,
      endDate: goal.endDate,
      type: goal.type,
      priority: (goal as any).priority || 'medium',
      status: goal.status
    });
    setShowAddForm(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vision': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-700';
      case 'long-term': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'mid-term': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'short-term': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vision': return 'ビジョン';
      case 'long-term': return '長期目標';
      case 'mid-term': return '中期目標';
      case 'short-term': return '短期目標';
      default: return type;
    }
  };

  const getPriorityColor = (priority: GoalPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'active':
        return <Play className="h-3.5 w-3.5 text-green-600" />;
      case 'paused':
        return <Pause className="h-3.5 w-3.5 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-3.5 w-3.5 text-blue-600" />;
      default:
        return <MoreVertical className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700';
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  // Filter and sort goals
  const filteredGoals = goals
    .filter(goal => {
      const matchesSearch = !searchTerm || 
        goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        goal.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || goal.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'startDate':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'progress':
          return b.progress - a.progress;
        case 'priority':
          const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
          const aPriority = (a as any).priority || 'medium';
          const bPriority = (b as any).priority || 'medium';
          return priorityOrder[bPriority] - priorityOrder[aPriority];
        default:
          return 0;
      }
    });

  const parentOptions = goals.filter(g => g.level < 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">目標・進捗管理</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">理想の自分に向けた目標設定と進捗追跡を統合管理</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.id === 'goals' ? '目標・進捗' : tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'goals' && (
        <div>
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">進捗一覧</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                目標の進捗状況を確認し、次のアクションを計画しましょう
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>総目標数: {goals.length}</span>
                <span className="text-green-600">•</span>
                <span>アクティブ: {goals.filter(g => g.status === 'active').length}</span>
                <span className="text-blue-600">•</span>
                <span>平均進捗: {Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / Math.max(goals.length, 1))}%</span>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4" />
                <span>目標追加</span>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="目標を検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>フィルター</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">ステータス</label>
                    <Select 
                      value={statusFilter} 
                      onValueChange={(value) => setStatusFilter(value as GoalStatus | 'all')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="ステータスを選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全て</SelectItem>
                        <SelectItem value="active">進行中</SelectItem>
                        <SelectItem value="completed">完了</SelectItem>
                        <SelectItem value="paused">一時停止</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">並び順</label>
                    <Select 
                      value={sortBy} 
                      onValueChange={(value) => setSortBy(value as 'progress' | 'priority' | 'startDate')}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="並び順を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="startDate">開始日順</SelectItem>
                        <SelectItem value="progress">進捗順</SelectItem>
                        <SelectItem value="priority">優先度順</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Goals List - Unified View */}
          <div className="space-y-4">
            {filteredGoals.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredGoals.map((goal) => (
                  <div 
                    key={goal.id} 
                    className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowGoalDetail(true);
                    }}
                  >
                    {/* Goal Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <Target className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {goal.type === 'vision' ? 'ビジョン' : 
                             goal.type === 'long-term' ? '長期目標' : 
                             goal.type === 'mid-term' ? '中期目標' : '短期目標'}
                          </span>
                        </div>
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {goal.title}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                          {goal.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-3">
                        {getStatusIcon(goal.status)}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateTaskFromGoal(goal);
                          }} 
                          className="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-all duration-200" 
                          title="この目標からタスクを作成"
                        >
                          <List className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(goal);
                          }} 
                          className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-all duration-200"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGoal(goal.id);
                          }} 
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-all duration-200"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${getTypeColor(goal.type)}`}>
                        {getTypeLabel(goal.type)}
                      </span>
                      <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(goal.status)}`}>
                        {goal.status === 'active' ? '進行中' : goal.status === 'completed' ? '完了' : '一時停止'}
                      </span>
                      {(goal as any).priority && (
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full border ${getPriorityColor((goal as any).priority)}`}>
                          {(goal as any).priority === 'high' ? '高' : (goal as any).priority === 'medium' ? '中' : '低'}
                        </span>
                      )}
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">進捗</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className={`h-2 rounded-full transition-all duration-500 ${
                          goal.progress >= 80 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                          goal.progress >= 50 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                          goal.progress >= 20 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-gradient-to-r from-red-500 to-red-600'
                        }`} style={{ width: `${goal.progress}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{goal.startDate}</span>
                        <span>{goal.endDate}</span>
                      </div>
                    </div>

                    {/* Task Summary */}
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                        <CheckSquare className="h-3.5 w-3.5" />
                        <span>タスク: {getTaskCountForGoal(goal.id)}</span>
                      </div>
                      {getTaskCountForGoal(goal.id) > 0 && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          {getCompletedTaskCountForGoal(goal.id)}/{getTaskCountForGoal(goal.id)} 完了
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-6">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {searchTerm || statusFilter !== 'all' 
                        ? '進捗が見つかりません'
                        : '最初の進捗を記録しましょう'
                      }
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      {searchTerm || statusFilter !== 'all' 
                        ? '検索条件を変更するか、新しい目標を作成してください。'
                        : '理想の自分に向けた第一歩を踏み出しましょう。進捗を記録することで、あなたの成長を可視化できます。'
                      }
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        目標を追加
                      </Button>
                      {(searchTerm || statusFilter !== 'all') && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                            setStatusFilter('all');
                            setShowFilters(false);
                          }}
                        >
                          フィルターをリセット
                        </Button>
                      )}
                    </div>
                  </div>
                  {/* Quick Tips */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-purple-600 dark:text-purple-400 text-lg">📊</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">進捗記録</h4>
                      <p className="text-gray-600 dark:text-gray-400">定期的な進捗更新</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-blue-600 dark:text-blue-400 text-lg">🎯</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">目標設定</h4>
                      <p className="text-gray-600 dark:text-gray-400">明確な到達点</p>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-green-600 dark:text-green-400 text-lg">📈</span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">成長分析</h4>
                      <p className="text-gray-600 dark:text-gray-400">データに基づく改善</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Add/Edit Goal Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingGoal ? '目標を編集' : '新しい目標を追加'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">閉じる</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        目標タイトル *
                      </label>
                      <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="目標のタイトルを入力"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        目標タイプ *
                      </label>
                      <Select 
                        value={formData.type} 
                        onValueChange={(value) => setFormData({ ...formData, type: value as Goal['type'] })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="目標タイプを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="vision">ビジョン</SelectItem>
                          <SelectItem value="long-term">長期目標</SelectItem>
                          <SelectItem value="mid-term">中期目標</SelectItem>
                          <SelectItem value="short-term">短期目標</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      説明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="目標の詳細な説明を入力"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        優先度
                      </label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value) => setFormData({ ...formData, priority: value as GoalPriority })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ステータス
                      </label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value) => setFormData({ ...formData, status: value as GoalStatus })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">進行中</SelectItem>
                          <SelectItem value="paused">一時停止</SelectItem>
                          <SelectItem value="completed">完了</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        親目標
                      </label>
                      <Select 
                        value={formData.parentId} 
                        onValueChange={(value) => setFormData({ ...formData, parentId: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="親目標を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">なし</SelectItem>
                          {parentOptions.map(goal => (
                            <SelectItem key={goal.id} value={goal.id}>
                              {goal.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        開始日 *
                      </label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        終了日 *
                      </label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                    >
                      キャンセル
                    </Button>
                    <Button type="submit">
                      {editingGoal ? '更新' : '追加'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Task Form */}
          {showTaskForm && selectedGoalForTask && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      タスク作成
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      目標: {selectedGoalForTask.title}
                    </p>
                  </div>
                  <button
                    onClick={resetTaskForm}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <span className="sr-only">閉じる</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      タスクタイトル *
                    </label>
                    <Input
                      type="text"
                      value={taskFormData.title}
                      onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                      placeholder="タスクのタイトルを入力"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      説明
                    </label>
                    <textarea
                      value={taskFormData.description}
                      onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                      placeholder="タスクの詳細や実行方法を記入"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        期限
                      </label>
                      <Input
                        type="date"
                        value={taskFormData.dueDate}
                        onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        時間
                      </label>
                      <Input
                        type="time"
                        value={taskFormData.dueTime}
                        onChange={(e) => setTaskFormData({ ...taskFormData, dueTime: e.target.value })}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Recurrence-specific Date/Time Settings */}
                  {taskFormData.recurrence.type !== 'none' && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700">
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                          繰り返しタスクの設定
                        </span>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            開始日（最初の実行日）
                          </label>
                          <Input
                            type="date"
                            value={taskFormData.dueDate}
                            onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            この日付から繰り返しが開始されます
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              実行時間
                            </label>
                            <Input
                              type="time"
                              value={taskFormData.dueTime}
                              onChange={(e) => setTaskFormData({ ...taskFormData, dueTime: e.target.value })}
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              毎回同じ時間に実行
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              予想所要時間（分）
                            </label>
                            <Input
                              type="number"
                              min="1"
                              value={taskFormData.estimatedDuration}
                              onChange={(e) => setTaskFormData({ ...taskFormData, estimatedDuration: parseInt(e.target.value) || 30 })}
                              className="w-full"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              1回あたりの所要時間
                            </p>
                          </div>
                        </div>

                        {taskFormData.recurrence.type === 'weekly' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              曜日別の時間設定（オプション）
                            </label>
                            <div className="space-y-2">
                              {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => {
                                const isSelected = (taskFormData.recurrence.daysOfWeek || []).includes(index);
                                return (
                                  <div key={index} className={`flex items-center space-x-3 p-2 rounded-md ${
                                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700' : 'bg-gray-50 dark:bg-gray-700'
                                  }`}>
                                    <span className={`text-sm font-medium w-8 ${
                                      isSelected ? 'text-blue-700 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                      {day}
                                    </span>
                                    <Input
                                      type="time"
                                      disabled={!isSelected}
                                      value={taskFormData.weeklyTimes[index as keyof typeof taskFormData.weeklyTimes] || ''}
                                      onChange={(e) => setTaskFormData({
                                        ...taskFormData,
                                        weeklyTimes: {
                                          ...taskFormData.weeklyTimes,
                                          [index]: e.target.value
                                        }
                                      })}
                                      className="flex-1"
                                      placeholder="時間を設定"
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                               曜日ごとに異なる時間を設定できます。設定しない場合は共通の時間が使用されます。
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        優先度
                      </label>
                      <Select 
                        value={taskFormData.priority} 
                        onValueChange={(value) => setTaskFormData({ ...taskFormData, priority: value as 'high' | 'medium' | 'low' })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="優先度を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">高</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="low">低</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        ステータス
                      </label>
                      <Select 
                        value={taskFormData.status} 
                        onValueChange={(value) => setTaskFormData({ ...taskFormData, status: value as 'pending' | 'in-progress' | 'completed' })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">未着手</SelectItem>
                          <SelectItem value="in-progress">進行中</SelectItem>
                          <SelectItem value="completed">完了</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Recurrence Settings */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        繰り返し設定
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        タスクの繰り返しパターンを設定できます。毎日の習慣から月次の振り返りまで、柔軟に設定可能です。
                      </p>
                      <Select 
                        value={taskFormData.recurrence.type} 
                        onValueChange={(value) => setTaskFormData({ 
                          ...taskFormData, 
                          recurrence: { 
                            ...taskFormData.recurrence, 
                            type: value as TaskRecurrenceType 
                          } 
                        })}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="繰り返しパターンを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">繰り返しなし（1回のみ）</SelectItem>
                          <SelectItem value="daily">毎日</SelectItem>
                          <SelectItem value="weekly">毎週</SelectItem>
                          <SelectItem value="monthly">毎月</SelectItem>
                          <SelectItem value="custom">カスタム</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Custom Recurrence Options */}
                    {taskFormData.recurrence.type !== 'none' && (
                      <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        {taskFormData.recurrence.type === 'weekly' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              曜日を選択
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                                <button
                                  key={index}
                                  type="button"
                                  onClick={() => {
                                    const daysOfWeek = taskFormData.recurrence.daysOfWeek || [];
                                    const newDaysOfWeek = daysOfWeek.includes(index)
                                      ? daysOfWeek.filter(d => d !== index)
                                      : [...daysOfWeek, index];
                                    setTaskFormData({
                                      ...taskFormData,
                                      recurrence: {
                                        ...taskFormData.recurrence,
                                        daysOfWeek: newDaysOfWeek
                                      }
                                    });
                                  }}
                                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                    (taskFormData.recurrence.daysOfWeek || []).includes(index)
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {taskFormData.recurrence.type === 'monthly' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              月の何日か
                            </label>
                            <Select 
                              value={taskFormData.recurrence.dayOfMonth?.toString() || '1'} 
                              onValueChange={(value) => setTaskFormData({
                                ...taskFormData,
                                recurrence: {
                                  ...taskFormData.recurrence,
                                  dayOfMonth: parseInt(value)
                                }
                              })}
                            >
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="日を選択" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                                  <SelectItem key={day} value={day.toString()}>
                                    {day}日
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              間隔
                            </label>
                            <Input
                              type="number"
                              min="1"
                              value={taskFormData.recurrence.interval || 1}
                              onChange={(e) => setTaskFormData({
                                ...taskFormData,
                                recurrence: {
                                  ...taskFormData.recurrence,
                                  interval: parseInt(e.target.value) || 1
                                }
                              })}
                              className="w-[180px]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              終了日（オプション）
                            </label>
                            <Input
                              type="date"
                              value={taskFormData.recurrence.endDate || ''}
                              onChange={(e) => setTaskFormData({
                                ...taskFormData,
                                recurrence: {
                                  ...taskFormData.recurrence,
                                  endDate: e.target.value
                                }
                              })}
                              className="w-[180px]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            最大繰り返し回数（オプション）
                          </label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="無制限"
                            value={taskFormData.recurrence.maxOccurrences || ''}
                            onChange={(e) => setTaskFormData({
                              ...taskFormData,
                              recurrence: {
                                ...taskFormData.recurrence,
                                maxOccurrences: e.target.value ? parseInt(e.target.value) : 0
                              }
                            })}
                            className="w-[180px]"
                          />
                        </div>
                      </div>
                    )}

                    {/* Recurrence Preview */}
                    {taskFormData.recurrence.type !== 'none' && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">繰り返し設定プレビュー</span>
                        </div>
                        <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                          <p>
                            {(() => {
                              const { type, interval, daysOfWeek, dayOfMonth } = taskFormData.recurrence;
                              switch (type) {
                                case 'daily':
                                  return `毎${interval}日`;
                                case 'weekly':
                                  const selectedDays = daysOfWeek?.map(d => ['日', '月', '火', '水', '木', '金', '土'][d]).join('・') || '曜日未選択';
                                  return `毎${interval}週の${selectedDays}`;
                                case 'monthly':
                                  return `毎${interval}ヶ月の${dayOfMonth}日`;
                                case 'custom':
                                  return 'カスタム設定';
                                default:
                                  return '';
                              }
                            })()}
                          </p>
                          {taskFormData.dueTime && (
                            <p>実行時間: {taskFormData.dueTime}</p>
                          )}
                          {taskFormData.recurrence.type === 'weekly' && taskFormData.recurrence.daysOfWeek && taskFormData.recurrence.daysOfWeek.length > 0 && (
                            <div>
                              <p className="font-medium">曜日別時間設定:</p>
                              {taskFormData.recurrence.daysOfWeek.map(dayIndex => {
                                const dayName = ['日', '月', '火', '水', '木', '金', '土'][dayIndex];
                                const time = taskFormData.weeklyTimes[dayIndex as keyof typeof taskFormData.weeklyTimes];
                                return time ? (
                                  <p key={dayIndex} className="ml-2">・{dayName}: {time}</p>
                                ) : null;
                              })}
                            </div>
                          )}
                          <p>開始日: {taskFormData.dueDate}</p>
                          {taskFormData.recurrence.endDate && (
                            <p>終了日: {taskFormData.recurrence.endDate}</p>
                          )}
                          {taskFormData.recurrence.maxOccurrences && taskFormData.recurrence.maxOccurrences > 0 && (
                            <p>最大回数: {taskFormData.recurrence.maxOccurrences}回</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetTaskForm}
                    >
                      キャンセル
                    </Button>
                    <Button type="submit">
                      タスクを作成
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <TaskManagement />
      )}

      {activeTab === 'progress' && (
        <ProgressView />
      )}
    </div>
  );
}