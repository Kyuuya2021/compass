import React from 'react';
import { Target, Calendar, TrendingUp, Heart, Lightbulb, Sparkles, ArrowRight, Download, Share2, Edit } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { GlassFilter } from './ui/liquid-glass';

interface VisionData {
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
  coreValues: string[];
  motivation: string;
  obstacles: string[];
  resources: string[];
}

interface VisionResultProps {
  visionData: VisionData;
  onEdit?: () => void;
  onBack?: () => void;
}

export function VisionResult({ visionData, onEdit, onBack }: VisionResultProps) {
  const { theme, toggleTheme } = useTheme();

  const handleDownload = () => {
    const content = `
# あなたの将来指針

## 🎯 3年後のビジョン
${visionData.longTerm.join('\n')}

## 📅 1年以内の目標
${visionData.mediumTerm.map(goal => `- ${goal}`).join('\n')}

## 🚀 3ヶ月以内のアクション
${visionData.shortTerm.map(action => `- ${action}`).join('\n')}

## ❤️ 原動力
${visionData.motivation}

## 🔍 主な課題
${visionData.obstacles.map(obstacle => `- ${obstacle}`).join('\n')}

## 🛠️ 活用リソース
${visionData.resources.map(resource => `- ${resource}`).join('\n')}

---
作成日: ${new Date().toLocaleDateString('ja-JP')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `将来指針_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '私の将来指針',
        text: `3年後のビジョン: ${visionData.longTerm.join(', ')}`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`私の将来指針\n3年後のビジョン: ${visionData.longTerm.join(', ')}`);
      alert('将来指針をクリップボードにコピーしました！');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <GlassFilter />
      <div className="max-w-4xl w-full bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gray-900 dark:bg-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">将来指針が完成しました！</h1>
                <p className="text-sm text-gray-300">あなたの未来への道筋が明確になりました</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                >
                  ← 戻る
                </button>
              )}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                {theme === 'light' ? (
                  <div className="h-5 w-5 rounded-full border-2 border-current relative">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-current rounded-full transform translate-x-0.5 -translate-y-0.5"></div>
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full bg-current"></div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* 3年後のビジョン */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3年後のビジョン</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {visionData.longTerm.join('、')}
            </p>
          </div>

          {/* 1年以内の目標 */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1年以内の目標</h2>
            </div>
            <ul className="space-y-2">
              {visionData.mediumTerm.map((goal, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 3ヶ月以内のアクション */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3ヶ月以内のアクション</h2>
            </div>
            <ul className="space-y-2">
              {visionData.shortTerm.map((action, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <ArrowRight className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 原動力 */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <Heart className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">原動力</h2>
            </div>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {visionData.motivation}
            </p>
          </div>

          {/* 課題とリソース */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* 主な課題 */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">主な課題</h2>
              </div>
              <ul className="space-y-2">
                {visionData.obstacles.map((obstacle, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{obstacle}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 活用リソース */}
            <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">活用リソース</h2>
              </div>
              <ul className="space-y-2">
                {visionData.resources.map((resource, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{resource}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>ダウンロード</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>共有</span>
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="flex-1 flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>編集</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 