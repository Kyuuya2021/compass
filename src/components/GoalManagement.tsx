import React, { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { useGoals, Goal } from '../contexts/GoalContext';
import { BreadcrumbNavigation } from './BreadcrumbNavigation';

export function GoalManagement() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoals();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

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
      case 'vision': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'long-term': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'mid-term': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'short-term': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">目標管理</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">理想の自分に向けた目標を設定・管理しましょう</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" />
          <span>新しい目標</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingGoal ? '目標を編集' : '新しい目標を追加'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  目標タイトル *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="具体的で測定可能な目標を入力"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  目標タイプ *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Goal['type'] })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="vision">ビジョン（将来設計）</option>
                  <option value="long-term">長期目標（1-3年）</option>
                  <option value="mid-term">中期目標（3ヶ月-1年）</option>
                  <option value="short-term">短期目標（1日-3ヶ月）</option>
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
                placeholder="この目標を達成する理由や詳細を記入"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  親目標（任意）
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">独立した目標</option>
                  {parentOptions.map(goal => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  開始日 *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  目標日 *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
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
                {editingGoal ? '更新' : '追加'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-8">
        {Object.keys(groupedGoals)
          .sort((a, b) => parseInt(a) - parseInt(b))
          .map((level) => (
            <div key={level}>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                レベル {level} {level === '1' ? 'ビジョン・長期目標' : level === '2' ? '中期目標' : '短期目標・タスク'}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {groupedGoals[parseInt(level)].map((goal) => (
                  <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getTypeColor(goal.type)}`}>
                            {getTypeLabel(goal.type)}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3">{goal.description}</p>
                        )}
                        
                        {/* Breadcrumb for child goals */}
                        {goal.parentId && (
                          <BreadcrumbNavigation goalId={goal.id} />
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">進捗</span>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{goal.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-500"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{new Date(goal.startDate).toLocaleDateString('ja-JP')} - {new Date(goal.endDate).toLocaleDateString('ja-JP')}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(goal)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        title="編集"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="削除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}