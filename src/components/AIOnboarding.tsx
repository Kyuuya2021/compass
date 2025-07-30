import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Heart, Target, Lightbulb, Star, Mic, Plus, Globe, CheckCircle, ArrowRight } from 'lucide-react';
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
  type?: 'welcome' | 'question' | 'analysis' | 'vision' | 'confirmation';
}

interface OnboardingData {
  values: { [key: string]: { keywords: string[], examples: string[], intensity: number } };
  ideals: { [key: string]: string };
  currentState: { [key: string]: string };
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  lifeWheelScores: { [key: string]: { current: number, ideal: number } };
}

interface AIOnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

export function AIOnboarding({ onComplete, onSkip }: AIOnboardingProps) {
  const { updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは。私はあなた専属のキャリアコーチ、Compassです。🎯\n\nこれから15分程度のお時間をいただいて、あなたの価値観や理想の未来について一緒に探索していきたいと思います。\n\nこのプロセスを通じて、あなただけの「人生のコンパス」を作成し、日々の行動が理想の実現にどう繋がっているかを常に確認できるようになります。\n\n途中で中断されても、いつでも続きから再開できますので、リラックスしてお話しください。\n\n準備はよろしいでしょうか？',
      sender: 'ai',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phase, setPhase] = useState(0); // 0: welcome, 1: values, 2: ideals, 3: current, 4: vision, 5: confirmation
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    values: {},
    ideals: {},
    currentState: {},
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    lifeWheelScores: {}
  });
  const [sessionStarted, setSessionStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const phaseInfo = [
    { title: '導入', icon: <Sparkles className="h-4 w-4" />, description: 'プロセス説明' },
    { title: '価値観探索', icon: <Heart className="h-4 w-4" />, description: 'あなたが大切にしていること' },
    { title: '理想像明確化', icon: <Target className="h-4 w-4" />, description: '未来のありたい姿' },
    { title: '現状分析', icon: <Lightbulb className="h-4 w-4" />, description: '今とのギャップを整理' },
    { title: 'ビジョン作成', icon: <Star className="h-4 w-4" />, description: 'AI分析による人生設計' },
    { title: '最終調整', icon: <CheckCircle className="h-4 w-4" />, description: 'あなたらしさを反映' }
  ];

  const aiResponses: Record<number, (userInput?: string) => string> = {
    0: () => {
      setSessionStarted(true);
      return `素晴らしいですね！それでは始めましょう。\n\n【これから行うこと】\n✓ 価値観の探索（あなたが大切にしていることを明確にします）\n✓ 理想像の明確化（未来のありたい姿を描きます）\n✓ 現状分析（今とのギャップを整理します）\n✓ ビジョン作成（AI分析による人生設計の草案作成）\n✓ 最終調整（あなたらしさを反映した完成版にします）\n\n所要時間: 約15分\n進行方法: 対話形式での質問と回答\n\nまず、あなたの価値観について探索していきます。価値観とは、あなたが人生で最も大切にしている信念や原則のことです。\n\n最初の質問です：\n「あなたが仕事や人生において、これだけは譲れないと感じることは何ですか？具体的なエピソードがあれば、それも教えてください。」`;
    },
    1: (userInput: string = '') => {
      // 価値観分析
      const keywords = extractValueKeywords(userInput);
      setOnboardingData(prev => ({
        ...prev,
        values: { ...prev.values, primary: { keywords, examples: [userInput], intensity: 0.8 } }
      }));
      
      return `「${userInput}」というお話から、あなたの大切な価値観が伝わってきます。✨\n\n少し深掘りさせてください。新しいことを学ぶとき、どんな瞬間に最もやりがいを感じますか？\n\nまた、周囲の人との関係で特に大切にしていることがあれば教えてください。理想のチームや仲間の関係性はどのようなものでしょうか？`;
    },
    2: (userInput: string = '') => {
      setOnboardingData(prev => ({
        ...prev,
        values: { ...prev.values, secondary: { keywords: extractValueKeywords(userInput), examples: [userInput], intensity: 0.7 } }
      }));
      
      return `価値観についてよく理解できました。あなたは成長と人間関係を大切にされているのですね。🌟\n\n次に、理想像について探索していきましょう。\n\n5年後のあなたを想像してみてください。理想的な一日がどのように始まり、どのように終わるでしょうか？\n\n• どんな仕事をしていますか？\n• どんな人たちと時間を過ごしていますか？\n• どんな環境で生活していますか？\n• その時のあなたは、どんな気持ちでいるでしょうか？\n\n自由に想像して教えてください。`;
    },
    3: (userInput: string = '') => {
      setOnboardingData(prev => ({
        ...prev,
        ideals: { ...prev.ideals, fiveYear: userInput }
      }));
      
      return `素晴らしい理想像ですね！「${userInput.substring(0, 50)}...」という未来に向かって歩んでいく姿が目に浮かびます。🎯\n\n次に現状について整理しましょう。理想像と比較して、現在の状況をどう感じていますか？\n\n• 最も満足している部分はどこですか？その理由は？\n• 最も変えたいと感じている部分はどこですか？\n• 現在のあなたが持っている強みや資源を教えてください（スキル・知識・経験・人脈など）\n\n正直にお答えいただければと思います。`;
    },
    4: (userInput: string = '') => {
      setOnboardingData(prev => ({
        ...prev,
        currentState: { ...prev.currentState, analysis: userInput }
      }));
      
      return `現状分析をありがとうございます。これまでのお話を統合して、あなたの人生ビジョンの草案を作成いたします。\n\n少し時間をいただいて、あなただけの「人生のコンパス」をまとめますね...`;
    },
    5: (userInput: string = '') => {
      const visionDraft = generateVisionDraft(onboardingData, userInput);
      return `🎉 あなたの人生ビジョン（草案）が完成しました！\n\n## 🎯 コアビジョン\n「成長と貢献を通じて理想のライフスタイルを実現し、周囲の人々と共に価値を創造する」\n\n## 💎 あなたの価値観\n1. **成長・学習** - 新しい挑戦を通じた自己実現\n2. **人間関係** - 信頼できる仲間との協働\n3. **貢献・社会性** - 社会に価値を提供すること\n\n## 🌟 5年後の理想像\n${onboardingData.ideals.fiveYear}\n\n## 📊 現状分析サマリー\n現在の強みを活かしながら、理想の実現に向けて着実に歩んでいけると分析しています。\n\nこの草案をご覧いただいて：\n✓ あなたらしさが表現されていますか？\n✓ 心が躍るような内容になっていますか？\n✓ 実現したいと心から思える内容ですか？\n\n修正したい部分があれば教えてください。`;
    },
    6: (userInput: string = '') => {
      return `素晴らしいビジョンが完成しました！🎉\n\n最後に確認させてください：\n✅ このビジョンは、あなたが本当に実現したい未来を表していますか？\n✅ 価値観や理想像に納得していますか？\n✅ 実現に向けて行動を始めたいと思えますか？\n\nこのビジョンを確定すると、あなた専用の目標設定画面に移り、具体的な行動計画の作成をサポートします。\n\n確定してもいつでも見直し・更新が可能ですので、現時点での「あなたの人生のコンパス」として活用していただければと思います。\n\nビジョンを確定いたしますか？`;
    }
  };

  const extractValueKeywords = (text: string): string[] => {
    const valueKeywords = ['成長', '学習', '挑戦', '人間関係', '信頼', '協働', '貢献', '社会', '自由', '創造', '安定', '家族'];
    return valueKeywords.filter(keyword => text.includes(keyword));
  };

  const generateVisionDraft = (data: OnboardingData, latestInput: string) => {
    // AI分析ロジック（実際の実装では機械学習モデルを使用）
    return {
      coreVision: "成長と貢献を通じて理想のライフスタイルを実現する",
      values: Object.keys(data.values),
      ideals: data.ideals,
      analysis: "あなたの価値観と理想像から、実現可能で魅力的なビジョンを作成しました。"
    };
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = aiResponses[phase as keyof typeof aiResponses];
      let responseText: string;
      
      responseText = aiResponse(currentInput);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date(),
        type: phase === 4 ? 'vision' : 'question'
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (phase >= 6) {
        // Complete onboarding after final confirmation
        setTimeout(() => {
          const completionMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: `🎉 おめでとうございます！\n\nあなた専用の「人生のコンパス」が完成しました。\n\nこのビジョンが、日々の選択や行動の指針となり、理想の実現への確実な一歩一歩をサポートします。\n\n【次のステップ】\n✨ 具体的な目標設定（推奨：3つの重点目標から開始）\n✨ 日々のタスクとビジョンの連携設定\n✨ 進捗トラッキングとAIコーチング開始\n\nさあ、理想の未来に向けた行動を始めましょう！`,
            sender: 'ai',
            timestamp: new Date(),
            type: 'confirmation'
          };
          setMessages(prev => [...prev, completionMessage]);
          
          setTimeout(() => {
            updateUser({ 
              hasCompletedOnboarding: true,
              futureVision: onboardingData.ideals.fiveYear || "理想の未来を実現する",
              coreValues: Object.keys(onboardingData.values)
            });
            onComplete();
          }, 3000);
        }, 2000);
      } else {
        setPhase(prev => prev + 1);
      }
    }, 1500);
  };

  const getProgressPercentage = () => {
    if (!sessionStarted) return 0;
    return Math.min(((phase + 1) / 6) * 100, 100);
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
                <h1 className="text-lg sm:text-2xl font-bold text-white">AIガイド付きオンボーディング</h1>
                <p className="text-sm text-gray-300">あなたの価値観と理想像を一緒に発見しましょう</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onSkip && (
                <button
                  onClick={onSkip}
                  className="px-3 py-1.5 text-sm text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-lg transition-colors"
                >
                  スキップ
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
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span className="flex items-center space-x-2">
                {sessionStarted && phaseInfo[Math.min(phase, 5)].icon}
                <span>{sessionStarted ? phaseInfo[Math.min(phase, 5)].title : '開始前'}</span>
              </span>
              <span>{sessionStarted ? `${Math.min(phase + 1, 6)}/6` : '0/6'}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            {sessionStarted && (
              <div className="mt-2 text-xs text-gray-400">
                {phaseInfo[Math.min(phase, 5)].description}
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="h-80 sm:h-96 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                  {message.type === 'vision' && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Star className="h-3 w-3" />
                        <span>AI分析による個人ビジョン草案</span>
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

        {/* Input */}
        <div className="border-t border-gray-200 dark:border-gray-600 p-4 sm:p-6">
          <AIInput onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}>
            <AIInputTextarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="メッセージを入力してください..."
              disabled={isTyping}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton>
                  <Plus size={16} />
                </AIInputButton>
                <AIInputButton>
                  <Mic size={16} />
                </AIInputButton>
                <AIInputButton>
                  <Globe size={16} />
                  <span>検索</span>
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

        {/* Completion Button */}
        {phase >= 6 && (
          <div className="border-t border-gray-200 dark:border-gray-600 p-4 sm:p-6">
            <button
              onClick={onComplete}
              className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
            >
              <span>目標設定を開始する</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}