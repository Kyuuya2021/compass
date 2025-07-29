import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Goal {
  id: string;
  title: string;
  description: string;
  level: number;
  parentId?: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'active' | 'completed' | 'paused';
  type: 'vision' | 'long-term' | 'mid-term' | 'short-term';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  goalId: string;
  dueDate: string;
  dueTime?: string;
  estimatedDuration?: number; // minutes
  actualDuration?: number; // minutes
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: string;
  timeGranularity: 'annual' | 'quarterly' | 'monthly' | 'weekly' | 'daily' | 'hourly' | 'minutes';
  recurringPattern?: {
    type: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
    frequency: number;
    daysOfWeek?: number[]; // 0-6, Sunday = 0
    endDate?: string;
    exceptions?: string[];
  };
  scheduledStart?: string;
  scheduledEnd?: string;
  visionConnection?: {
    coreVisionRelevance: string;
    valueAlignment: string[];
    impactScore: number; // 0-10
    whyStatement: string;
  };
}

interface GoalContextType {
  goals: Goal[];
  tasks: Task[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getGoalHierarchy: (goalId: string) => Goal[];
  getTodaysTasks: () => Task[];
  getTasksWithVisionConnection: () => Task[];
  updateTaskVisionConnection: (taskId: string, connection: Task['visionConnection']) => void;
  calculateTaskImpactScore: (task: Task) => number;
  getTaskHierarchyPath: (taskId: string) => { vision: string; goal: string; task: string };
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

// ローカルストレージのキー
const STORAGE_KEYS = {
  GOALS: 'compass_goals',
  TASKS: 'compass_tasks',
  USER_DATA: 'compass_user_data'
};

// ローカルストレージユーティリティ
const storage = {
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  set: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error writing to localStorage:', error);
      return false;
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }
};

// デフォルトデータ
const defaultGoals: Goal[] = [
  {
    id: '1',
    title: 'グローバルに活躍するエンジニアになる',
    description: '技術力を磨き、世界中の人々と協働できるエンジニアとして成長する',
    level: 1,
    startDate: '2025-01-01',
    endDate: '2035-01-01',
    progress: 25,
    status: 'active',
    type: 'vision'
  },
  {
    id: '2',
    title: '3年以内に海外赴任する',
    description: 'グローバルプロジェクトのリーダーとして海外で働く',
    level: 2,
    parentId: '1',
    startDate: '2025-01-01',
    endDate: '2028-01-01',
    progress: 40,
    status: 'active',
    type: 'long-term'
  },
  {
    id: '3',
    title: '1年以内にTOEIC900点取得',
    description: 'ビジネス英語力を向上させて国際的なコミュニケーション能力を身につける',
    level: 3,
    parentId: '2',
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    progress: 60,
    status: 'active',
    type: 'mid-term'
  }
];

const defaultTasks: Task[] = [
  {
    id: '1',
    title: '英語学習アプリで毎日30分学習',
    description: 'DuolingoやMemriseで日常的に英語に触れる',
    goalId: '3',
    dueDate: '2025-12-31',
    dueTime: '09:00',
    estimatedDuration: 30,
    priority: 'high',
    status: 'pending',
    timeGranularity: 'daily'
  },
  {
    id: '2',
    title: '技術ブログを週1回更新',
    description: '学んだ技術をアウトプットして知識を定着させる',
    goalId: '1',
    dueDate: '2025-12-31',
    dueTime: '20:00',
    estimatedDuration: 120,
    priority: 'medium',
    status: 'pending',
    timeGranularity: 'weekly'
  }
];

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // 初期化時にローカルストレージからデータを読み込み
  useEffect(() => {
    const loadData = () => {
      try {
        // 保存されたデータを読み込み
        const savedGoals = storage.get(STORAGE_KEYS.GOALS);
        const savedTasks = storage.get(STORAGE_KEYS.TASKS);

        // データが存在する場合は使用、存在しない場合はデフォルトデータを使用
        setGoals(savedGoals || defaultGoals);
        setTasks(savedTasks || defaultTasks);
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // エラーが発生した場合はデフォルトデータを使用
        setGoals(defaultGoals);
        setTasks(defaultTasks);
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // データが変更されたときにローカルストレージに保存
  useEffect(() => {
    if (isInitialized) {
      storage.set(STORAGE_KEYS.GOALS, goals);
    }
  }, [goals, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      storage.set(STORAGE_KEYS.TASKS, tasks);
    }
  }, [tasks, isInitialized]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString()
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    // 関連するタスクも削除
    setTasks(prev => prev.filter(task => task.goalId !== id));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString()
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const getGoalHierarchy = (goalId: string): Goal[] => {
    const hierarchy: Goal[] = [];
    let currentGoal = goals.find(g => g.id === goalId);
    
    while (currentGoal) {
      hierarchy.unshift(currentGoal);
      currentGoal = goals.find(g => g.id === currentGoal?.parentId);
    }
    
    return hierarchy;
  };

  const getTodaysTasks = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      const taskDateString = taskDate.toISOString().split('T')[0];
      return taskDateString === todayString;
    });
  };

  const getTasksWithVisionConnection = () => {
    return tasks.filter(task => task.visionConnection);
  };

  const updateTaskVisionConnection = (taskId: string, connection: Task['visionConnection']) => {
    updateTask(taskId, { visionConnection: connection });
  };

  const calculateTaskImpactScore = (task: Task): number => {
    if (!task.visionConnection) return 0;
    
    let score = 0;
    
    // 優先度によるスコア
    switch (task.priority) {
      case 'high': score += 3; break;
      case 'medium': score += 2; break;
      case 'low': score += 1; break;
    }
    
    // ビジョン接続によるスコア
    if (task.visionConnection.impactScore) {
      score += task.visionConnection.impactScore;
    }
    
    // 期限によるスコア（期限が近いほど高スコア）
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 0) score += 5; // 期限切れ
    else if (daysUntilDue <= 3) score += 4; // 3日以内
    else if (daysUntilDue <= 7) score += 3; // 1週間以内
    else if (daysUntilDue <= 30) score += 2; // 1ヶ月以内
    else score += 1;
    
    return Math.min(score, 10); // 最大10点
  };

  const getTaskHierarchyPath = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return { vision: '', goal: '', task: '' };
    
    const goal = goals.find(g => g.id === task.goalId);
    const vision = goals.find(g => g.id === goal?.parentId);
    
    return {
      vision: vision?.title || '',
      goal: goal?.title || '',
      task: task.title
    };
  };

  const clearAllData = () => {
    setGoals(defaultGoals);
    setTasks(defaultTasks);
    storage.remove(STORAGE_KEYS.GOALS);
    storage.remove(STORAGE_KEYS.TASKS);
  };

  const exportData = () => {
    const data = {
      goals,
      tasks,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    return JSON.stringify(data, null, 2);
  };

  const importData = (dataString: string): boolean => {
    try {
      const data = JSON.parse(dataString);
      
      if (data.goals && Array.isArray(data.goals)) {
        setGoals(data.goals);
      }
      
      if (data.tasks && Array.isArray(data.tasks)) {
        setTasks(data.tasks);
      }
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const value: GoalContextType = {
    goals,
    tasks,
    addGoal,
    updateGoal,
    deleteGoal,
    addTask,
    updateTask,
    deleteTask,
    getGoalHierarchy,
    getTodaysTasks,
    getTasksWithVisionConnection,
    updateTaskVisionConnection,
    calculateTaskImpactScore,
    getTaskHierarchyPath,
    clearAllData,
    exportData,
    importData
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
}