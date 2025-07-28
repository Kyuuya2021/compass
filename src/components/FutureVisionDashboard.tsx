import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Target, 
  TrendingUp, 
  Heart, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  Lightbulb,
  ChevronRight,
  Edit,
  BarChart3,
  CheckCircle,
  ArrowUp,
  Brain,
  Zap,
  Users,
  Home,
  Globe
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGoals } from '../contexts/GoalContext';
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

export function FutureVisionDashboard() {
  const { user } = useAuth();
  const { goals, tasks, getTodaysTasks, updateTask, addTask, calculateTaskImpactScore, getTaskHierarchyPath } = useGoals();
  const [visionData, setVisionData] = useState<VisionData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month'>('day');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    goalId: '',
    dueTime: '',
    estimatedDuration: 30,
    priority: 'medium' as 'high' | 'medium' | 'low'
  });
  const [dailyReflection, setDailyReflection] = useState({
    alignment: '',
    valuesMoment: '',
    improvement: '',
    summary: ''
  });

  const todaysTasks = getTodaysTasks();
  const completedTasks = todaysTasks.filter(t => t.status === 'completed');
  const completionRate = todaysTasks.length > 0 ? Math.round((completedTasks.length / todaysTasks.length) * 100) : 0;

  const handleCompleteTask = (taskId: string) => {
    updateTask(taskId, { 
      status: 'completed',
      completedAt: new Date().toISOString()
    });
  };

  const generateVisionConnection = (taskData: typeof taskFormData, goalTitle?: string) => {
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
      },
      '学習': {
        coreVisionRelevance: '継続的な成長と自己実現',
        valueAlignment: ['成長・学習'],
        impactScore: 7.5,
        whyStatement: '新しい知識とスキルを身につけ、理想の自分に近づく'
      },
      '読書': {
        coreVisionRelevance: '知識と洞察力の向上',
        valueAlignment: ['成長・学習', '創造・革新'],
        impactScore: 6.8,
        whyStatement: '多様な視点と深い知識を得て、より良い判断と創造的な解決策を生み出す'
      }
    };

    // タスクタイトルや説明からキーワードを検索
    const taskText = `${taskData.title} ${taskData.description}`.toLowerCase();
    
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

  const handleCreateTask = () => {
    if (!taskFormData.title.trim()) return;

    const today = new Date().toISOString().split('T')[0];
    const goalTitle = goals.find(g => g.id === taskFormData.goalId)?.title;
    const visionConnection = generateVisionConnection(taskFormData, goalTitle);
    
    const newTask = {
      title: taskFormData.title,
      description: taskFormData.description,
      goalId: taskFormData.goalId,
      dueDate: today,
      dueTime: taskFormData.dueTime,
      estimatedDuration: taskFormData.estimatedDuration,
      timeGranularity: 'daily' as const,
      priority: taskFormData.priority,
      status: 'pending' as const,
      scheduledStart: taskFormData.dueTime ? `${today}T${taskFormData.dueTime}:00` : undefined,
      scheduledEnd: taskFormData.dueTime && taskFormData.estimatedDuration ? 
        new Date(new Date(`${today}T${taskFormData.dueTime}:00`).getTime() + taskFormData.estimatedDuration * 60000).toISOString() : undefined,
      visionConnection
    };

    addTask(newTask);
    
    // フォームをリセット
    setTaskFormData({
      title: '',
      description: '',
      goalId: '',
      dueTime: '',
      estimatedDuration: 30,
      priority: 'medium'
    });
    setShowTaskForm(false);
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800';
      case 'medium': return 'text-yellow-600 bg-yellow-100 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800';
      case 'low': return 'text-green-600 bg-green-100 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      default: return 'text-gray-600 bg-gray-100 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600';
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

  const handleReflectionSubmit = () => {
    // Save daily reflection
    console.log('Daily reflection saved:', dailyReflection);
    // Reset form
    setDailyReflection({
      alignment: '',
      valuesMoment: '',
      improvement: '',
      summary: ''
    });
  };

  if (!visionData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="text-center py-12">
          <Compass className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">将来指針を読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Header - Life Compass Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Compass className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {user?.name}さんの人生コンパス
          </h1>
        </div>

        {/* Core Vision */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">🎯 あなたのコアビジョン</h2>
              <p className="text-gray-900 dark:text-white leading-relaxed mb-3">
                "{visionData.coreVision}"
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span>💫 設定から 128日 経過</span>
                <span className="flex items-center space-x-1">
                  <span>📈 総合実現度: {overallRealization}%</span>
                  <ArrowUp className="h-3 w-3 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">(+3% 今月)</span>
                </span>
              </div>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <Edit className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Values Scoreboard */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {visionData.values.map((value, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{value.icon}</span>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">{value.score}%</span>
                  {value.trend > 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingUp className="h-3 w-3 text-red-500 rotate-180" />
                  )}
                </div>
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-1">{value.name}</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-500"
                  style={{ width: `${value.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Today's Focus */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-3">
            <Target className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-1">🔍 今日の重点テーマ: 「技術スキル向上」</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-1">📌 理想との繋がり: 革新的ソリューション提供力の強化</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">⏰ 推奨集中時間: 午前 9:00-11:00（あなたの集中ピーク）</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main - Today's Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Action Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5" />
                  <span>今日のアクション</span>
                </h2>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    完了率: {completionRate}% ({completedTasks.length}/{todaysTasks.length})
                  </div>
                  <button
                    onClick={() => setShowTaskForm(true)}
                    className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center space-x-1"
                  >
                    <Plus className="h-4 w-4" />
                    <span>タスク追加</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Task Creation Form */}
            {showTaskForm && (
              <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">新しいタスクを追加</h3>
                  <button
                    onClick={() => setShowTaskForm(false)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      タスク名 *
                    </label>
                    <input
                      type="text"
                      value={taskFormData.title}
                      onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="今日取り組むタスクを入力"
                    />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        関連目標
                      </label>
                      <select
                        value={taskFormData.goalId}
                        onChange={(e) => setTaskFormData({ ...taskFormData, goalId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="">目標を選択（任意）</option>
                        {goals.map((goal) => (
                          <option key={goal.id} value={goal.id}>
                            {goal.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        優先度
                      </label>
                      <select
                        value={taskFormData.priority}
                        onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      >
                        <option value="high">高優先度</option>
                        <option value="medium">中優先度</option>
                        <option value="low">低優先度</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        予定時刻
                      </label>
                      <input
                        type="time"
                        value={taskFormData.dueTime}
                        onChange={(e) => setTaskFormData({ ...taskFormData, dueTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        所要時間（分）
                      </label>
                      <input
                        type="number"
                        value={taskFormData.estimatedDuration}
                        onChange={(e) => setTaskFormData({ ...taskFormData, estimatedDuration: parseInt(e.target.value) || 30 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        min="5"
                        max="480"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      詳細（任意）
                    </label>
                    <textarea
                      value={taskFormData.description}
                      onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={2}
                      placeholder="タスクの詳細や実行方法を記入"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setShowTaskForm(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleCreateTask}
                      disabled={!taskFormData.title.trim()}
                      className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      追加
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="p-4 sm:p-6 space-y-4">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => {
                  const taskGoal = goals.find(g => g.id === task.goalId);
                  const hierarchyPath = getTaskHierarchyPath(task.id);
                  const impactScore = calculateTaskImpactScore(task);
                  
                return (
                  <div key={task.id} className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={() => handleCompleteTask(task.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              task.status === 'completed'
                                ? 'border-gray-800 dark:border-gray-200 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900'
                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400'
                            }`}
                          >
                            {task.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                          </button>
                          <h3 className={`font-semibold ${task.status === 'completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                            {task.title}
                          </h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {task.description}
                        </p>
                        
                        {/* Connection Hierarchy */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-600">
                          <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">🧭 繋がり階層:</h4>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <Home className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">
                                コアビジョン: {hierarchyPath.vision}
                              </span>
                            </div>
                            {hierarchyPath.goal && (
                              <div className="flex items-center space-x-2">
                                <Target className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-300">目標: {hierarchyPath.goal}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-300">今日: {hierarchyPath.task}</span>
                            </div>
                          </div>
                        </div>

                        {/* Vision Connection */}
                        {task.visionConnection && (
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3 border border-blue-200 dark:border-blue-800">
                            <h4 className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-2">💡 なぜこのタスクが重要？</h4>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mb-2">
                              {task.visionConnection.whyStatement}
                            </p>
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-blue-500 dark:text-blue-400">価値観:</span>
                              {task.visionConnection.valueAlignment.map((value, index) => (
                                <span key={index} className="flex items-center space-x-1">
                                  <span>{getValueIcon(value)}</span>
                                  <span className="text-blue-600 dark:text-blue-300">{value}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          {task.dueTime && (
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>予定: {task.dueTime}</span>
                            </span>
                          )}
                          {task.estimatedDuration && (
                            <span>{task.estimatedDuration}分</span>
                          )}
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            🎖️ 実現寄与度: +{impactScore.toFixed(1)}%
                          </span>
                        </div>
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

          {/* Current Goals Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>進行中の重要目標</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 dark:text-white text-sm">{goal.title}</h3>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{goal.progress}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">期限まで18日</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gray-900 dark:bg-white h-2 rounded-full transition-all duration-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">今週の進捗: +12%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Vision Details */}
        <div className="space-y-6">
          {/* Vision Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>あなたの理想像</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">🌅 理想の一日（5年後）</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>• 朝: {visionData.idealDay.morning}</li>
                  <li>• 午後: {visionData.idealDay.afternoon}</li>
                  <li>• 夕方: {visionData.idealDay.evening}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">💼 提供している価値</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {visionData.providedValue.map((value, index) => (
                    <li key={index}>• {value}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">🏡 生活スタイル</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {visionData.lifestyle.map((style, index) => (
                    <li key={index}>• {style}</li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-2 pt-2">
                <button className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  詳細表示
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                  見直し・更新
                </button>
              </div>
            </div>
          </div>

          {/* Values Reminder */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>大切な価値観</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              {visionData.values.slice(0, 2).map((value, index) => (
                <div key={index}>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 flex items-center space-x-2">
                    <span>{value.icon}</span>
                    <span>{value.name}</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">"{value.description}"</p>
                </div>
              ))}

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">🎯 今週の価値観実践チェック</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">新技術の学習（6/7日）</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-gray-600 dark:text-gray-300">他者への支援（3回）</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="h-4 w-4 border-2 border-gray-300 dark:border-gray-600 rounded" />
                    <span className="text-gray-600 dark:text-gray-300">地域活動参加（0回）</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Growth Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>成長ハイライト</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6 space-y-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">📈 最近の成長ポイント</h3>
              {visionData.monthlyGrowth.map((growth, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{growth.date}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{growth.achievement}</div>
                    <div className="text-xs text-blue-600 dark:text-blue-400">→ 成長度 +{growth.impact}%</div>
                  </div>
                </div>
              ))}
              <div className="flex space-x-2 pt-2">
                <button className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  成長履歴
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  マイルストーン
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Coach Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Coach からの洞察</span>
            </h2>
          </div>
          <div className="p-4 sm:p-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">🤖 今日のパターン分析</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                今週は技術学習への取り組みが順調ですね。特に午前中の集中時間の活用が効果的です。
                <br /><br />
                一方で『社会貢献』の価値観実現がやや停滞しています。技術ブログの執筆やコミュニティ活動への参加を検討してみてはいかがでしょうか？
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">💡 推奨アクション</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span>今日の学習内容をブログ記事にまとめる</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Users className="h-3 w-3 text-blue-500" />
                  <span>週末の勉強会参加を検討する</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Heart className="h-3 w-3 text-red-500" />
                  <span>後輩への技術相談対応時間を設ける</span>
                </li>
              </ul>
            </div>

            <div className="flex space-x-2 pt-4">
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                詳細分析
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors">
                アクション追加
              </button>
            </div>
          </div>
        </div>

        {/* Daily Reflection */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Lightbulb className="h-5 w-5" />
              <span>今日の振り返り</span>
            </h2>
          </div>
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">🤔 今日のセルフチェック</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Q1. 今日の行動は理想に近づくものでしたか？
                  </label>
                  <div className="flex space-x-2">
                    {['とても', 'まあまあ', '改善要'].map((option) => (
                      <button
                        key={option}
                        onClick={() => setDailyReflection({...dailyReflection, alignment: option})}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          dailyReflection.alignment === option
                            ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                    Q2. 最も価値観を実感できた瞬間は？
                  </label>
                  <textarea
                    value={dailyReflection.valuesMoment}
                    onChange={(e) => setDailyReflection({...dailyReflection, valuesMoment: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={2}
                    placeholder="価値観を実感した瞬間を記入..."
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                    🎯 一言で今日を表すと...
                  </label>
                  <input
                    type="text"
                    value={dailyReflection.summary}
                    onChange={(e) => setDailyReflection({...dailyReflection, summary: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="今日を一言で表現..."
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={handleReflectionSubmit}
                className="flex-1 px-3 py-2 text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                保存
              </button>
              <button className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                AI分析依頼
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}