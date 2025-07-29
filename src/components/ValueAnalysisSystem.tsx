import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Heart, Brain, Sparkles, Target, Lightbulb, Star, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { GlassFilter } from './ui/liquid-glass';
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from './ui/ai-input';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
  type?: 'surface' | 'core' | 'soul' | 'analysis' | 'insight';
  valueLayer?: 'surface' | 'core' | 'soul';
}

interface ValueAnalysis {
  layer: 'surface' | 'core' | 'soul';
  values: Array<{
    name: string;
    description: string;
    confidence: number;
    examples: string[];
    depth_indicators: string[];
  }>;
  insights: string[];
  next_questions: string[];
}

interface ValueEvolution {
  surface_values: string[];
  core_values: string[];
  soul_values: string[];
  evolution_story: string;
  growth_patterns: string[];
}

interface ValueAnalysisSystemProps {
  onComplete?: (analysis: ValueEvolution) => void;
  onBack?: () => void;
}

export function ValueAnalysisSystem({ onComplete, onBack }: ValueAnalysisSystemProps) {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！私はSophia、あなた専属の価値観分析AIコーチです。🌟\n\n今日は、あなたの価値観を3つの層に分けて深く探索していきます：\n\n🌊 **表層価値観**: 日常の選択や好みに現れる価値観\n💎 **核心価値観**: 人生の重要な決断を支える価値観\n✨ **魂の価値観**: あなたの存在意義に関わる最も深い価値観\n\nこの探索を通じて、あなたの本当の価値観と理想の自分を発見していきましょう。\n\n準備はよろしいですか？まずは表層価値観から始めましょう。',
      sender: 'ai',
      timestamp: new Date(),
      type: 'surface'
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<'surface' | 'core' | 'soul'>('surface');
  const [layerProgress, setLayerProgress] = useState({ surface: 0, core: 0, soul: 0 });
  const [valueAnalysis, setValueAnalysis] = useState<ValueEvolution>({
    surface_values: [],
    core_values: [],
    soul_values: [],
    evolution_story: '',
    growth_patterns: []
  });
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(['surface']));
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const layerInfo = {
    surface: {
      title: '表層価値観',
      icon: <Target className="h-4 w-4" />,
      description: '日常的な好み・選択基準',
      color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
      questions: [
        '最近購入したもので、特に満足しているものを教えてください。なぜそれを選び、なぜ満足しているのでしょうか？',
        '休日の過ごし方で、最もエネルギーが回復するのはどんな時間ですか？その理由も教えてください。',
        '仕事や学習において、どんな環境や方法が最も集中できますか？',
        '人との関わり方で、自然と心地よく感じるのはどんなスタイルですか？'
      ]
    },
    core: {
      title: '核心価値観',
      icon: <Heart className="h-4 w-4" />,
      description: '人生の重要な決断基準',
      color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800',
      questions: [
        '人生で最も困難だった時期を思い出してください。その時、何が最も大切だと感じましたか？何があなたを支えましたか？',
        '重要な決断をする時、心の奥で「これだけは譲れない」と感じることがあれば教えてください。',
        'あなたが心から尊敬する人がいれば、その人のどこに魅力を感じますか？',
        '将来への不安を感じる時、何があれば安心できると思いますか？'
      ]
    },
    soul: {
      title: '魂の価値観',
      icon: <Sparkles className="h-4 w-4" />,
      description: '存在意義・人生の使命',
      color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800',
      questions: [
        'もし今日が人生最後の日だとしたら、何を最も大切にしたいですか？それはなぜですか？',
        'あなたがこの世界に生まれてきた意味は何だと思いますか？直感的に感じることを教えてください。',
        '100年後、あなたのことを覚えている人がいるとしたら、どんなことで覚えられていたいですか？',
        'あなたの存在によって、世界がどのように良くなると思いますか？'
      ]
    }
  };

  const analyzeValueDepth = (userResponse: string, layer: 'surface' | 'core' | 'soul') => {
    // 簡単な価値観抽出ロジック（実際の実装ではより高度なNLP処理）
    const valueKeywords = {
      surface: {
        '美的感覚': ['美しい', '綺麗', 'デザイン', '見た目', '美'],
        '効率性': ['効率', '早い', '便利', '簡単', '時短'],
        '快適性': ['快適', '楽', 'リラックス', '心地よい'],
        '社交性': ['人', '友達', '仲間', '一緒', '交流']
      },
      core: {
        '真正性': ['本当', '正直', '素直', '自分らしい', '偽らない'],
        '成長': ['成長', '学び', '向上', '発展', '進歩'],
        '貢献': ['役立つ', '貢献', '支える', '助ける', '価値'],
        '自由': ['自由', '選択', '自立', '独立', '束縛されない']
      },
      soul: {
        '愛と繋がり': ['愛', '繋がり', '絆', '関係', '共感'],
        '創造と美': ['創造', '美', '芸術', '表現', '創る'],
        '智恵と真理': ['真理', '智恵', '理解', '洞察', '本質'],
        '調和と平和': ['調和', '平和', 'バランス', '統合', '一体']
      }
    };

    const detectedValues = [];
    const keywords = valueKeywords[layer];
    
    for (const [valueName, valueKeywords] of Object.entries(keywords)) {
      const matchCount = valueKeywords.filter(keyword => 
        userResponse.toLowerCase().includes(keyword)
      ).length;
      
      if (matchCount > 0) {
        detectedValues.push({
          name: valueName,
          description: `${valueName}を重視する価値観`,
          confidence: Math.min(matchCount * 0.3 + 0.4, 1.0),
          examples: [userResponse.substring(0, 100) + '...'],
          depth_indicators: [`${layer}レベルでの${valueName}の表現`]
        });
      }
    }

    return detectedValues;
  };

  const generateAIResponse = (userInput: string, layer: 'surface' | 'core' | 'soul', questionIndex: number) => {
    const detectedValues = analyzeValueDepth(userInput, layer);
    const layerData = layerInfo[layer];
    const currentProgress = layerProgress[layer];
    
    // 価値観分析の更新
    setValueAnalysis(prev => ({
      ...prev,
      [`${layer}_values`]: [...prev[`${layer}_values` as keyof ValueEvolution] as string[], ...detectedValues.map(v => v.name)]
    }));

    // 進捗の更新
    const newProgress = Math.min(currentProgress + 25, 100);
    setLayerProgress(prev => ({ ...prev, [layer]: newProgress }));

    if (newProgress < 100) {
      // 同じ層の次の質問
      const nextQuestion = layerData.questions[questionIndex + 1] || layerData.questions[0];
      return `素晴らしい洞察ですね！「${userInput.substring(0, 50)}...」から、あなたの${layerData.title}が見えてきます。\n\n${detectedValues.length > 0 ? `特に「${detectedValues[0].name}」の価値観が強く表れていますね。✨` : ''}\n\n次の質問です：\n${nextQuestion}`;
    } else {
      // 次の層への移行
      if (layer === 'surface') {
        setCurrentLayer('core');
        setExpandedLayers(prev => new Set([...prev, 'core']));
        return `表層価値観の探索が完了しました！🎉\n\nあなたの表層価値観：${detectedValues.map(v => v.name).join('、')}\n\n次は、より深い「核心価値観」を探索していきましょう。これは人生の重要な決断を支える、あなたの心の奥にある価値観です。\n\n${layerInfo.core.questions[0]}`;
      } else if (layer === 'core') {
        setCurrentLayer('soul');
        setExpandedLayers(prev => new Set([...prev, 'soul']));
        return `核心価値観の探索が完了しました！💎\n\nあなたの核心価値観：${detectedValues.map(v => v.name).join('、')}\n\n最後に、最も深い「魂の価値観」を探索します。これはあなたの存在意義や人生の使命に関わる、最も本質的な価値観です。\n\n${layerInfo.soul.questions[0]}`;
      } else {
        // 全層完了
        return generateFinalAnalysis();
      }
    }
  };

  const generateFinalAnalysis = () => {
    const analysis = `🌟 **価値観分析完了！** 🌟\n\nあなたの3層価値観プロファイルが完成しました：\n\n🌊 **表層価値観**: ${valueAnalysis.surface_values.join('、')}\n💎 **核心価値観**: ${valueAnalysis.core_values.join('、')}\n✨ **魂の価値観**: ${valueAnalysis.soul_values.join('、')}\n\n## 🔍 統合分析\n\nあなたの価値観は「${valueAnalysis.surface_values[0] || '美的感覚'}」という日常的な好みから始まり、「${valueAnalysis.core_values[0] || '成長'}」という人生の指針、そして「${valueAnalysis.soul_values[0] || '愛と繋がり'}」という存在意義まで、一貫した流れを持っています。\n\nこの価値観プロファイルを基に、あなたの理想の自分と具体的な行動指針を作成していきましょう！`;

    // 完了処理
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          ...valueAnalysis,
          evolution_story: analysis,
          growth_patterns: ['表層から核心への深化', '個人的価値から社会的価値への拡張']
        });
      }
    }, 3000);

    return analysis;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date(),
      valueLayer: currentLayer
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // 現在の質問インデックスを計算
    const currentQuestionIndex = Math.floor(layerProgress[currentLayer] / 25);

    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput, currentLayer, currentQuestionIndex);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: currentLayer,
        valueLayer: currentLayer
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const toggleLayerExpansion = (layer: string) => {
    setExpandedLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layer)) {
        newSet.delete(layer);
      } else {
        newSet.add(layer);
      }
      return newSet;
    });
  };

  const getProgressPercentage = () => {
    const totalProgress = layerProgress.surface + layerProgress.core + layerProgress.soul;
    return Math.round(totalProgress / 3);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <GlassFilter />
      <div className="max-w-6xl w-full bg-gray-50 dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="bg-gray-900 dark:bg-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">多層価値観分析システム</h1>
                <p className="text-sm text-gray-300">Sophia AI による深層価値観探索</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
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
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>全体進捗</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>

          {/* Layer Progress */}
          <div className="mt-4 space-y-2">
            {Object.entries(layerInfo).map(([key, layer]) => (
              <div key={key} className="flex items-center justify-between">
                <button
                  onClick={() => toggleLayerExpansion(key)}
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {layer.icon}
                  <span>{layer.title}</span>
                  {expandedLayers.has(key) ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </button>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-white/20 rounded-full h-1">
                    <div 
                      className="bg-white rounded-full h-1 transition-all duration-500"
                      style={{ width: `${layerProgress[key as keyof typeof layerProgress]}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-400 w-8">
                    {layerProgress[key as keyof typeof layerProgress]}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-3 max-w-3xl ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'ai' 
                      ? 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300' 
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                  }`}>
                    {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={`px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{message.text}</p>
                    {message.valueLayer && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${layerInfo[message.valueLayer].color}`}>
                          {layerInfo[message.valueLayer].icon}
                          <span>{layerInfo[message.valueLayer].title}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Sidebar - Layer Details */}
          <div className="w-80 border-l border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-750 p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">価値観層の詳細</h3>
            
            <div className="space-y-4">
              {Object.entries(layerInfo).map(([key, layer]) => (
                <div key={key} className={`border rounded-lg p-3 ${
                  expandedLayers.has(key) ? 'border-gray-300 dark:border-gray-600' : 'border-gray-200 dark:border-gray-700'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`inline-flex items-center space-x-2 text-sm px-2 py-1 rounded-full ${layer.color}`}>
                      {layer.icon}
                      <span className="font-medium">{layer.title}</span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {layerProgress[key as keyof typeof layerProgress]}%
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {layer.description}
                  </p>
                  
                  {expandedLayers.has(key) && (
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        発見された価値観:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {valueAnalysis[`${key}_values` as keyof ValueEvolution].map((value, index) => (
                          <span key={index} className="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-full">
                            {value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 sm:p-6">
          <AIInput onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}>
            <AIInputTextarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="あなたの価値観について深く考えて、正直にお答えください..."
              disabled={isTyping}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton>
                  <Lightbulb size={16} />
                  <span>ヒント</span>
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                onClick={handleSendMessage}
                disabled={!currentInput.trim() || isTyping}
              >
                <Send size={16} />
              </AIInputSubmit>
            </AIInputToolbar>
          </AIInput>
        </div>
      </div>
    </div>
  );
}