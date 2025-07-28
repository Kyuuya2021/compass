import React, { useState } from 'react';
import { Calendar, Clock, BarChart3, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGoals } from '../contexts/GoalContext';

type ViewMode = 'day' | 'week' | 'month';

export function TimeManagement() {
  const { tasks } = useGoals();
  const [viewMode, setViewMode] = useState<ViewMode>('day');
  const [currentDate, setCurrentDate] = useState(new Date());

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour < 24; hour++) {
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        hour: hour
      });
    }
    return slots;
  };

  const getTasksForTimeSlot = (hour: number) => {
    const today = currentDate.toISOString().split('T')[0];
    return tasks.filter(task => {
      if (task.dueDate !== today || !task.dueTime) return false;
      const taskHour = parseInt(task.dueTime.split(':')[0]);
      return taskHour === hour;
    });
  };

  const getWeekDays = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - day);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('ja-JP', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      });
    } else if (viewMode === 'week') {
      const weekDays = getWeekDays();
      const start = weekDays[0].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
      const end = weekDays[6].toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
      return `${start} - ${end}`;
    } else {
      return currentDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">時間管理</h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">時間軸でタスクを可視化・管理しましょう</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
            {(['day', 'week', 'month'] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {mode === 'day' ? '日' : mode === 'week' ? '週' : '月'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex items-center justify-between mb-6 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => navigateDate('prev')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {formatDateHeader()}
        </h2>
        
        <button
          onClick={() => navigateDate('next')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Time View */}
      {viewMode === 'day' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>タイムライン</span>
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {getTimeSlots().map((slot) => {
              const tasksInSlot = getTasksForTimeSlot(slot.hour);
              return (
                <div key={slot.time} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <div className="flex">
                    <div className="w-16 sm:w-20 flex-shrink-0 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{slot.time}</div>
                    </div>
                    <div className="flex-1 p-3 sm:p-4 min-h-[60px]">
                      {tasksInSlot.length > 0 ? (
                        <div className="space-y-2">
                          {tasksInSlot.map((task) => (
                            <div key={task.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-gray-900 dark:border-white">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">{task.title}</h4>
                                  {task.description && (
                                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
                                  )}
                                  <div className="flex items-center space-x-2 mt-2">
                                    {task.estimatedDuration && (
                                      <span className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-0.5 rounded-full">
                                        {task.estimatedDuration}分
                                      </span>
                                    )}
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                                      'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                    }`}>
                                      {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-400 dark:text-gray-500 text-sm italic">空き時間</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>週間ビュー</span>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 min-w-full">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                <div className="text-sm font-medium text-gray-900 dark:text-white">時間</div>
              </div>
              {getWeekDays().map((day, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 last:border-r-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {day.toLocaleDateString('ja-JP', { weekday: 'short', day: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
            
            {getTimeSlots().slice(0, 12).map((slot) => (
              <div key={slot.time} className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-600 dark:text-gray-400">{slot.time}</div>
                </div>
                {getWeekDays().map((day, dayIndex) => (
                  <div key={dayIndex} className="p-2 border-r border-gray-100 dark:border-gray-700 last:border-r-0 min-h-[40px]">
                    {/* Week view task rendering would go here */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">月間ビューは今後のアップデートで実装予定です</p>
          </div>
        </div>
      )}
    </div>
  );
}