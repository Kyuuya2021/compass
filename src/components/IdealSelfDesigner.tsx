import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Star, Target, Heart, Globe, Calendar, Sparkles, ArrowRight, Download, Share2 } from 'lucide-react';
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
  type?: 'character' | 'competence' | 'connection' | 'contribution' | 'experience';
}

interface IdealSelfProfile {
  character_traits: string[];
  competencies: string[];
  relationships: string[];
  contributions: string[];
  experiences: string[];
  daily_embodiment: string[];
  growth_milestones: Array<{
    timeframe: string;
    milestone: string;
    indicators: string[];
  }>;
}

interface IdealSelfDesignerProps {
  valueAnalysis?: {
    surface_values: string[];
    core_values: string[];
    soul_values: string[];
  };
  onComplete?: (profile: IdealSelfProfile) => void;
  onBack?: () => void;
}

export function IdealSelfDesigner({ valueAnalysis, onComplete, onBack }: IdealSelfDesignerProps) {
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `こんにちは！今度は「Future Self Designer」として、あなたの理想の自分を多角的に描いていきましょう。✨\n\n価値観分析で発見された：\n🌊 表層価値観: ${valueAnalysis?.surface_values.join('、') || '美的感覚、効率性'}\n💎 核心価値観: ${valueAnalysis?.core_values.join('、') || '成長、貢献'}\n✨ 魂の価値観: ${valueAnalysis?.soul_values.join('、') || '愛と繋がり'}\n\nこれらの価値観を基に、5つの次元から理想の自分を構築します：\n\n🎭 **人格的側面**: どんな性格・人柄でありたいか\n🎯 **能力的側面**: どんなスキル・専門性を持ちたいか\n🤝 **関係的側面**: どんな人間関係を築きたいか\n🌍 **貢献的側面**: どんな価値を世界に提供したいか\n💫 **体験的側面**: どんな人生体験をしたいか\n\nまずは「理想の一日」から始めましょう。10年後の理想的な一日を想像してください。朝起きてから夜眠るまで、どんな風に過ごしていますか？`,
      sender: 'ai',
      timestamp: new Date(),
      type: 'experience'
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentDimension, setCurrentDimension] = useState<'character' | 'competence' | 'connection' | 'contribution' | 'experience'>('experience');
  const [dimensionProgress, setDimensionProgress] = useState({
    character: 0,
    competence: 0,
    connection: 0,
    contribution: 0,
    experience: 0
  });
  const [idealSelfProfile, setIdealSelfProfile] = useState<IdealSelfProfile>({
    character_traits: [],
    competencies: [],
    relationships: [],
    contributions: [],
    experiences: [],
    daily_embodiment: [],
    growth_milestones: []
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const dimensionInfo = {
    experience: {
      title: '体験的側面',
      icon: <Star className="h-4 w-4" />,
      description: 'どんな人生体験をしたいか',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800',
      questions: [
        '10年後の理想的な一日を想像してください。朝起きてから夜眠るまで、どんな風に過ごしていますか？',
        'その日のあなたは、どんな気持ちで過ごしているでしょうか？どんな感情を日常的に味わいたいですか？',
        'どんな環境で過ごしたいですか？住む場所、働く場所、リラックスする場所について教えてください。'
      ]
    },
    character: {
      title: '人格的側面',
      icon: <Heart className="h-4 w-4" />,
      description: 'どんな性格・人柄でありたいか',
      color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800',
      questions: [
        '心から尊敬する人、憧れる人はいますか？その人のどこに魅力を感じますか？',
        'あなたもそんな風になりたいと思う性格や人柄の特徴があれば教えてください。',
        '現在の自分の性格で、さらに伸ばしたい部分や、変えたい部分があれば教えてください。'
      ]
    },
    competence: {
      title: '能力的側面',
      icon: <Target className="h-4 w-4" />,
      description: 'どんなスキル・専門性を持ちたいか',
      color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800',
      questions: [
        'どんなスキルや知識を身につけたいですか？専門分野でも趣味でも構いません。',
        'どんな分野で専門性を発揮したいですか？どんな問題解決能力を持ちたいですか？',
        '理想の自分は、どんなことができる人でしょうか？'
      ]
    },
    connection: {
      title: '関係的側面',
      icon: <Globe className="h-4 w-4" />,
      description: 'どんな人間関係を築きたいか',
      color: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800',
      questions: [
        'どんな人間関係を築きたいですか？家族、友人、同僚、コミュニティについて教えてください。',
        'どんな影響を人に与えたいですか？どんな存在でありたいですか？',
        'どんなコミュニティに属したいですか？どんな役割を果たしたいですか？'
      ]
    },
    contribution: {
      title: '貢献的側面',
      icon: <Sparkles className="h-4 w-4" />,
      description: 'どんな価値を世界に提供したいか',
      color: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800',
      questions: [
        'どんな価値を世界に提供したいですか？どんな問題解決に関わりたいですか？',
        '20年後のあなたから、今のあなたに手紙が届いたとします。その手紙には何が書かれていると思いますか？',
        'あなたの人生が終わる時、どんな遺産を残したいですか？どんなことで覚えられていたいですか？'
      ]
    }
  };

  const extractIdealSelfElements = (userResponse: string, dimension: keyof typeof dimensionInfo) => {
    // 簡単な要素抽出ロジック（実際の実装ではより高度なNLP処理）
    const elements = [];
    const response = userResponse.toLowerCase();

    const dimensionKeywords = {
      experience: ['感じる', '体験', '過ごす', '味わう', '楽しむ', '環境', '場所'],
      character: ['性格', '人柄', '優しい', '強い', '誠実', '創造的', '冷静', '情熱的'],
      competence: ['スキル', '能力', '専門', '知識', '技術', 'できる', '解決'],
      connection: ['関係', '人', '家族', '友人', '仲間', 'コミュニティ', '影響'],
      contribution: ['貢献', '価値', '提供', '解決', '支援', '遺産', '社会']
    };

    // キーワードベースの要素抽出
    const keywords = dimensionKeywords[dimension];
    keywords.forEach(keyword => {
      if (response.includes(keyword)) {
        elements.push(`${keyword}に関する理想`);
      }
    });

    // 文章から具体的な要素を抽出（簡易版）
    const sentences = userResponse.split(/[。！？]/).filter(s => s.trim().length > 0);
    elements.push(...sentences.slice(0, 2).map(s => s.trim()));

    return elements;
  };

  const generateAIResponse = (userInput: string, dimension: keyof typeof dimensionInfo, questionIndex: number) => {
    const extractedElements = extractIdealSelfElements(userInput, dimension);
    const dimensionData = dimensionInfo[dimension];
    const currentProgress = dimensionProgress[dimension];
    
    // 理想自己プロファイルの更新
    setIdealSelfProfile(prev => ({
      ...prev,
      [`${dimension === 'character' ? 'character_traits' : 
         dimension === 'competence' ? 'competencies' :
         dimension === 'connection' ? 'relationships' :
         dimension === 'contribution' ? 'contributions' : 'experiences'}`]: 
        [...prev[`${dimension === 'character' ? 'character_traits' : 
                   dimension === 'competence' ? 'competencies' :
                   dimension === 'connection' ? 'relationships' :
                   dimension === 'contribution' ? 'contributions' : 'experiences'}`], 
         ...extractedElements]
    }));

    // 進捗の更新
    const newProgress = Math.min(currentProgress + 33, 100);
    setDimensionProgress(prev => ({ ...prev, [dimension]: newProgress }));

    if (newProgress < 100) {
      // 同じ次元の次の質問
      const nextQuestion = dimensionData.questions[questionIndex + 1];
      return `素晴らしいビジョンですね！「${userInput.substring(0, 50)}...」から、あなたの理想の${dimensionData.title}が鮮明に見えてきます。✨\n\n次の質問です：\n${nextQuestion}`;
    } else {
      // 次の次元への移行
      const dimensionOrder: (keyof typeof dimensionInfo)[] = ['experience', 'character', 'competence', 'connection', 'contribution'];
      const currentIndex = dimensionOrder.indexOf(dimension);
      
      if (currentIndex < dimensionOrder.length - 1) {
        const nextDimension = dimensionOrder[currentIndex + 1];
        setCurrentDimension(nextDimension);
        return `${dimensionData.title}の探索が完了しました！🎉\n\n次は「${dimensionInfo[nextDimension].title}」を探索していきましょう。\n\n${dimensionInfo[nextDimension].questions[0]}`;
      } else {
        // 全次元完了
        return generateFinalProfile();
      }
    }
  };

  const generateFinalProfile = () => {
    const profile = `🌟 **理想の自分プロファイル完成！** 🌟\n\nあなたの多面的な理想像が完成しました：\n\n🎭 **人格的側面**: ${idealSelfProfile.character_traits.slice(0, 3).join('、')}\n🎯 **能力的側面**: ${idealSelfProfile.competencies.slice(0, 3).join('、')}\n🤝 **関係的側面**: ${idealSelfProfile.relationships.slice(0, 3).join('、')}\n🌍 **貢献的側面**: ${idealSelfProfile.contributions.slice(0, 3).join('、')}\n💫 **体験的側面**: ${idealSelfProfile.experiences.slice(0, 3).join('、')}\n\n## 🎯 統合された理想像\n\nあなたの理想の自分は、価値観に深く根ざした一貫性のある存在です。この理想像を実現するための具体的な成長パスと行動指針を作成していきましょう！`;

    // 成長マイルストーンの生成
    const milestones = [
      {
        timeframe: '3ヶ月後',
        milestone: '理想の自分の基盤作り',
        indicators: ['日常習慣の確立', '基礎スキルの習得開始', '価値観の実践開始']
      },
      {
        timeframe: '1年後',
        milestone: '理想像の部分的実現',
        indicators: ['専門性の向上', '人間関係の質的向上', '貢献活動の開始']
      },
      {
        timeframe: '3年後',
        milestone: '理想の自分の体現',
        indicators: ['専門分野での認知', '影響力の拡大', '持続的な貢献']
      }
    ];

    setIdealSelfProfile(prev => ({
      ...prev,
      growth_milestones: milestones,
      daily_embodiment: [
        '朝の価値観確認', '理想の自分を意識した行動選択', '夜の振り返りと感謝'
      ]
    }));

    // 完了処理
    setTimeout(() => {
      if (onComplete) {
        onComplete({
          ...idealSelfProfile,
          growth_milestones: milestones
        });
      }
    }, 3000);

    return profile;
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date(),
      type: currentDimension
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // 現在の質問インデックスを計算
    const currentQuestionIndex = Math.floor(dimensionProgress[currentDimension] / 33);

    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput, currentDimension, currentQuestionIndex);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: currentDimension
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getProgressPercentage = () => {
    const totalProgress = Object.values(dimensionProgress).reduce((sum, progress) => sum + progress, 0);
    return Math.round(totalProgress / 5);
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
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">Future Self Designer</h1>
                <p className="text-sm text-gray-300">理想の自分を多角的に構築</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {onBack && (
                <button
                  onClick={onBack}
                  className="px-3 py-1 text-sm text-gray-300 hover:text-white transition-colors"
                >
                  戻る
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

          {/* Dimension Progress */}
          <div className="mt-4 grid grid-cols-5 gap-2">
            {Object.entries(dimensionInfo).map(([key, dimension]) => (
              <div key={key} className="text-center">
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full mb-1 ${
                  currentDimension === key ? 'bg-white text-gray-900' : 'bg-white/20 text-white'
                }`}>
                  {dimension.icon}
                </div>
                <div className="text-xs text-gray-300 mb-1">{dimension.title}</div>
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white rounded-full h-1 transition-all duration-500"
                    style={{ width: `${dimensionProgress[key as keyof typeof dimensionProgress]}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 sm:p-6 space-y-4">
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
                  {message.type && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <div className={`inline-flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${dimensionInfo[message.type].color}`}>
                        {dimensionInfo[message.type].icon}
                        <span>{dimensionInfo[message.type].title}</span>
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
              placeholder="理想の自分について、自由に想像して詳しく教えてください..."
              disabled={isTyping}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton>
                  <Calendar size={16} />
                  <span>未来日記</span>
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