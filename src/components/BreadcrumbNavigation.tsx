import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { useGoals } from '../contexts/GoalContext';

interface BreadcrumbNavigationProps {
  goalId: string;
  currentTask?: string;
}

export function BreadcrumbNavigation({ goalId, currentTask }: BreadcrumbNavigationProps) {
  const { getGoalHierarchy } = useGoals();
  const hierarchy = getGoalHierarchy(goalId);

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'vision': return '🏠';
      case 'long-term': return '🎯';
      case 'mid-term': return '📈';
      case 'short-term': return '⭐';
      default: return '📌';
    }
  };

  return (
    <nav className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400 mb-2 overflow-x-auto">
      {hierarchy.map((goal, index) => (
        <React.Fragment key={goal.id}>
          <div className="flex items-center space-x-1">
            <span>{getGoalIcon(goal.type)}</span>
            <span className="truncate max-w-16 sm:max-w-24 whitespace-nowrap" title={goal.title}>
              {goal.title}
            </span>
          </div>
          {index < hierarchy.length - 1 && (
            <ChevronRight className="h-3 w-3 text-gray-400" />
          )}
        </React.Fragment>
      ))}
      {currentTask && (
        <>
          <ChevronRight className="h-3 w-3 text-gray-400 dark:text-gray-500" />
          <div className="flex items-center space-x-1">
            <span>✅</span>
            <span className="truncate max-w-20 sm:max-w-32 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap" title={currentTask}>
              {currentTask}
            </span>
          </div>
        </>
      )}
    </nav>
  );
}