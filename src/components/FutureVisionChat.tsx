import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Target, Lightbulb, Star, Mic, Plus, Globe, Calendar, TrendingUp, Heart, ArrowLeft } from 'lucide-react';
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
  type?: 'vision' | 'goal' | 'action' | 'timeline';
}

interface VisionData {
  shortTerm: string[];
  mediumTerm: string[];
  longTerm: string[];
  coreValues: string[];
  motivation: string;
  obstacles: string[];
  resources: string[];
}

interface FutureVisionChatProps {
  onComplete?: (visionData: VisionData) => void;
  onBack?: () => void;
}

export function FutureVisionChat({ onComplete, onBack }: FutureVisionChatProps) {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！あなたの将来指針を作成するお手伝いをさせていただきます。🎯\n\nまず、あなたが3年後に達成したい最も重要な目標を教えてください。\n\n具体的に想像してみてください：\n• 仕事では何をしている？\n• プライベートではどんな時間を過ごしている？\n• 周りの人からはどう見られている？\n\n自由に語ってください。',
      sender: 'ai',
      timestamp: new Date(),
      type: 'vision'
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);
  const [visionData, setVisionData] = useState<VisionData>({
    shortTerm: [],
    mediumTerm: [],
    longTerm: [],
    coreValues: [],
    motivation: '',
    obstacles: [],
    resources: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = {
    1: (userInput: string) => {
      setVisionData(prev => ({ ...prev, longTerm: [userInput] }));
      return `素晴らしいビジョンですね！「${userInput}」という3年後の目標に向かって歩んでいく姿が目に浮かびます。🌟\n\n次に、その目標を達成するために、1年以内に達成したい具体的な目標を3つ教えてください。\n\n例えば：\n• スキルアップ（資格取得、技術習得など）\n• 人間関係（ネットワーク構築、コミュニケーション改善など）\n• 健康・生活習慣（運動、食事、睡眠など）\n\nできるだけ具体的で測定可能な目標にしてください。`;
    },
    2: (userInput: string) => {
      const goals = userInput.split(/[,、]/).map(g => g.trim()).filter(g => g);
      setVisionData(prev => ({ ...prev, mediumTerm: goals }));
      return `とても具体的な目標ですね！「${goals.join('」「')}」を1年以内に達成する計画を立てましょう。📅\n\nでは、これらの目標を達成するために、今月から3ヶ月以内に取り組みたい具体的なアクションを教えてください。\n\n例えば：\n• 毎日30分英語学習する\n• 週2回ジムに通う\n• 月1回セミナーに参加する\n\nできるだけ具体的で実行可能なアクションにしてください。`;
    },
    3: (userInput: string) => {
      const actions = userInput.split(/[,、]/).map(a => a.trim()).filter(a => a);
      setVisionData(prev => ({ ...prev, shortTerm: actions }));
      return `素晴らしいアクションプランですね！「${actions.join('」「')}」を3ヶ月以内に実行していくことで、大きな変化が期待できます。💪\n\n次に、あなたの価値観や信念で、この目標達成を支える最も重要なものは何でしょうか？\n\n例えば：\n• 成長への情熱\n• 家族への愛\n• 社会貢献への使命感\n• 自己実現への欲求\n\n心の奥底にある原動力を教えてください。`;
    },
    4: (userInput: string) => {
      setVisionData(prev => ({ ...prev, motivation: userInput }));
      return `とても深い洞察ですね。「${userInput}」があなたの原動力なのですね。❤️\n\nでは、この目標達成を阻む可能性のある障害や課題は何でしょうか？\n\n例えば：\n• 時間の不足\n• 資金の制約\n• 知識・スキルの不足\n• 周囲の理解不足\n• モチベーションの維持\n\n正直に教えてください。課題を明確にすることで、対策を立てることができます。`;
    },
    5: (userInput: string) => {
      const obstacles = userInput.split(/[,、]/).map(o => o.trim()).filter(o => o);
      setVisionData(prev => ({ ...prev, obstacles }));
      return `なるほど、「${obstacles.join('」「')}」が主な課題なのですね。🔍\n\nでは、これらの課題を克服するために、あなたが活用できるリソースやサポートは何でしょうか？\n\n例えば：\n• 家族・友人のサポート\n• オンライン学習プラットフォーム\n• メンターやコーチ\n• コミュニティやネットワーク\n• 書籍や教材\n• 時間管理ツール\n\nあなたが持っている、またはアクセスできるリソースを教えてください。`;
    },
    6: (userInput: string) => {
      const resources = userInput.split(/[,、]/).map(r => r.trim()).filter(r => r);
      setVisionData(prev => ({ ...prev, resources }));
      return `素晴らしいリソースですね！「${resources.join('」「')}」を活用することで、課題を克服できる可能性が高まります。🚀\n\nこれまでのお話から、あなたの将来指針を作成いたします。\n\n少し時間をいただいて、あなただけのカスタマイズされた将来指針をまとめますね...`;
    }
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
      const aiResponse = aiResponses[step as keyof typeof aiResponses];
      let responseText: string;
      
      if (typeof aiResponse === 'function') {
        responseText = aiResponse(currentInput);
      } else {
        responseText = aiResponse;
      }
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (step >= 6) {
        // Complete vision creation after final message
        setTimeout(() => {
          const summaryMessage: Message = {
            id: (Date.now() + 2).toString(),
            text: `🎯 **あなたの将来指針**\n\n**3年後のビジョン**: ${visionData.longTerm.join('、')}\n**1年以内の目標**: ${visionData.mediumTerm.join('、')}\n**3ヶ月以内のアクション**: ${visionData.shortTerm.join('、')}\n**原動力**: ${visionData.motivation}\n**主な課題**: ${visionData.obstacles.join('、')}\n**活用リソース**: ${visionData.resources.join('、')}\n\nこの将来指針をもとに、具体的な行動計画を立てていきましょう！`,
            sender: 'ai',
            timestamp: new Date()
          };
          setMessages(prev => [...prev, summaryMessage]);
          
          setTimeout(() => {
            if (onComplete) {
              onComplete(visionData);
            }
          }, 3000);
        }, 2000);
      } else {
        setStep(prev => prev + 1);
      }
    }, 1500);
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <Target className="h-4 w-4" />;
      case 2: return <Calendar className="h-4 w-4" />;
      case 3: return <TrendingUp className="h-4 w-4" />;
      case 4: return <Heart className="h-4 w-4" />;
      case 5: return <Lightbulb className="h-4 w-4" />;
      case 6: return <Sparkles className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return '3年後のビジョン';
      case 2: return '1年以内の目標';
      case 3: return '3ヶ月以内のアクション';
      case 4: return '原動力の発見';
      case 5: return '課題の特定';
      case 6: return 'リソースの整理';
      default: return '完了';
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
                <h1 className="text-lg sm:text-2xl font-bold text-white">将来指針作成AI</h1>
                <p className="text-sm text-gray-300">あなたの未来を一緒に設計しましょう</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>戻る</span>
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
                {getStepIcon(step)}
                <span>{getStepTitle(step)}</span>
              </span>
              <span>{step}/6</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(step / 6) * 100}%` }}
              />
            </div>
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
      </div>
    </div>
  );
} 