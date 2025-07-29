import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2, CheckSquare, BarChart3 } from 'lucide-react';
import { useGoals, Goal } from '../contexts/GoalContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';
import { TaskManagement } from './TaskManagement';
import { ProgressView } from './ProgressView';

type TabType = 'goals' | 'tasks' | 'progress';

export function GoalManagement() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('goals');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    parentId: '',
    startDate: '',
    endDate: '',
    type: 'mid-term' as Goal['type']
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      parentId: '',
      startDate: '',
      endDate: '',
      type: 'mid-term'
    });
    setShowAddForm(false);
    setEditingGoal(null);
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
        status: 'active'
      });
    }
    
    resetForm();
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      parentId: goal.parentId || '',
      startDate: goal.startDate,
      endDate: goal.endDate,
      type: goal.type
    });
    setShowAddForm(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vision': return 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800';
      case 'long-term': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
      case 'mid-term': return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900 dark:text-teal-300 dark:border-teal-800';
      case 'short-term': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      default: return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vision': return 'ビジョン';
      case 'long-term': return '長期目標';
      case 'mid-term': return '中期目標';
      case 'short-term': return '短期目標';
      default: return '';
    }
  };

  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.level]) acc[goal.level] = [];
    acc[goal.level].push(goal);
    return acc;
  }, {} as Record<number, Goal[]>);

  const parentOptions = goals.filter(g => g.level < 3); // Allow up to 3 levels for MVP

  const tabs = [
    { id: 'goals' as TabType, label: '目標管理', icon: Target },
    { id: 'tasks' as TabType, label: 'タスク管理', icon: CheckSquare },
    { id: 'progress' as TabType, label: '進捗分析', icon: BarChart3 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">目標・タスク管理</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">理想の自分に向けた目標とタスクを管理しましょう</p>
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
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'goals' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">目標一覧</h2>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>目標追加</span>
            </button>
          </div>

          {/* Goals List */}
          <div className="space-y-4">
            {Object.entries(groupedGoals).map(([level, levelGoals]) => (
              <div key={level} className="space-y-3">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {level === '1' ? 'ビジョン・長期目標' : level === '2' ? '中期目標' : '短期目標'}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {levelGoals.map((goal) => (
                    <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{goal.description}</p>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(goal.type)}`}>
                            {getTypeLabel(goal.type)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(goal)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500 dark:text-gray-400">進捗</span>
                          <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>{goal.startDate}</span>
                          <span>{goal.endDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Goal Form */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {editingGoal ? '目標を編集' : '新しい目標を追加'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      目標名
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      説明
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        開始日
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        終了日
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      タイプ
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as Goal['type'] }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="vision">ビジョン</option>
                      <option value="long-term">長期目標</option>
                      <option value="mid-term">中期目標</option>
                      <option value="short-term">短期目標</option>
                    </select>
                  </div>
                  {parentOptions.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        親目標（任意）
                      </label>
                      <select
                        value={formData.parentId}
                        onChange={(e) => setFormData(prev => ({ ...prev, parentId: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">なし</option>
                        {parentOptions.map(goal => (
                          <option key={goal.id} value={goal.id}>{goal.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      {editingGoal ? '更新' : '追加'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-gray-700 dark:text-white rounded-lg transition-colors"
                    >
                      キャンセル
                    </button>
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