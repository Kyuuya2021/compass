import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([
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
  ]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: '英単語50個暗記',
      description: 'TOEIC頻出単語を覚える',
      goalId: '3',
      dueDate: '2025-01-29',
      dueTime: '09:00',
      estimatedDuration: 30,
      timeGranularity: 'daily',
      priority: 'high',
      status: 'pending',
      scheduledStart: '2025-01-29T08:30:00',
      scheduledEnd: '2025-01-29T09:00:00'
    },
    {
      id: '2',
      title: 'リスニング練習30分',
      description: 'TOEIC Part3, 4の問題を解く',
      goalId: '3',
      dueDate: '2025-01-29',
      dueTime: '19:00',
      estimatedDuration: 30,
      timeGranularity: 'daily',
      priority: 'high',
      status: 'pending',
      scheduledStart: '2025-01-29T18:30:00',
      scheduledEnd: '2025-01-29T19:00:00'
    },
    {
      id: '3',
      title: 'プログラミング学習1時間',
      description: 'React.jsの新機能について学習',
      goalId: '2',
      dueDate: '2025-01-29',
      dueTime: '20:00',
      estimatedDuration: 60,
      timeGranularity: 'daily',
      priority: 'medium',
      status: 'pending',
      scheduledStart: '2025-01-29T20:00:00',
      scheduledEnd: '2025-01-29T21:00:00'
    }
  ]);

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Date.now().toString() };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, ...updates } : goal
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
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
      currentGoal = currentGoal.parentId 
        ? goals.find(g => g.id === currentGoal!.parentId)
        : undefined;
    }
    
    return hierarchy;
  };

  const getTodaysTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => 
      task.dueDate === today && task.status !== 'completed'
    );
  };

  return (
    <GoalContext.Provider value={{
      goals,
      tasks,
      addGoal,
      updateGoal,
      deleteGoal,
      addTask,
      updateTask,
      deleteTask,
      getGoalHierarchy,
      getTodaysTasks
    }}>
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