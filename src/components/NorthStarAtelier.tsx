import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Star, Compass, MapPin, Anchor, Plus } from 'lucide-react';
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
  type?: 'welcome' | 'values' | 'ideal-self' | 'final-goals' | 'synthesis';
}

interface NorthStarAtelierProps {
  onComplete?: () => void;
  onBack?: () => void;
}

export function NorthStarAtelier({ onComplete, onBack }: NorthStarAtelierProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！私は北極星アトリエのナビゲーター、Polarisです。🌟\n\n今日は、あなたの人生の「北極星」を一緒に設計していきましょう。\n\n私たちは以下の3つの要素を明確に区別して設計します：\n\n🧭 **価値観（コンパス）**: あなたの行動や判断の基準となる方向性\n🏝️ **理想の自分（目的地）**: 価値観を体現した結果の人物像\n⚓ **最終目標（寄港地）**: 目的地に向かう具体的な到達点\n\nこの区別により、ブレない人生設計と日々の行動の原動力を生み出します。\n\n準備はよろしいですか？',
      sender: 'ai',
      timestamp: new Date(),
      type: 'welcome'
    }
  ]);
  
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'values' | 'ideal-self' | 'final-goals' | 'synthesis'>('values');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const phaseInfo = {
    values: {
      title: '価値観（コンパス）設計',
      icon: <Compass className="h-4 w-4" />,
      description: 'あなたの行動や判断の基準となる方向性を明確にする',
      metaphor: '🧭 コンパス（方位磁針）',
      questions: [
        '人生で最も大切にしていることは何ですか？（例：成長、貢献、自由、愛）',
        'どんな時に「自分らしい」と感じますか？',
        '尊敬する人はなぜ尊敬できるのですか？',
        '人生の重要な決断を下す時、どんな基準を使いますか？'
      ]
    },
    'ideal-self': {
      title: '理想の自分（目的地）設計',
      icon: <MapPin className="h-4 w-4" />,
      description: '価値観を体現した結果の具体的な人物像を描く',
      metaphor: '🏝️ 目的地（島）',
      questions: [
        'その価値観を体現した結果、あなたはどんな人物になっていますか？',
        '10年後、周りの人からどう言われたいですか？',
        '理想の自分は、どんな特徴や性格を持っていますか？',
        '理想の自分は、社会にどんな貢献をしていますか？'
      ]
    },
    'final-goals': {
      title: '最終目標（寄港地）設計',
      icon: <Anchor className="h-4 w-4" />,
      description: '目的地に向かう具体的で測定可能な到達点を設定する',
      metaphor: '⚓ 寄港地（港）',
      questions: [
        '理想の自分になるために、何を成し遂げる必要がありますか？',
        'どんな成果を出せば、理想に近づいたと実感できますか？',
        '具体的な期限と測定可能な指標を設定してください',
        'その目標を達成した時、どんな変化が起きていますか？'
      ]
    },
    synthesis: {
      title: '統合・完成',
      icon: <Star className="h-4 w-4" />,
      description: '全ての要素を統合して人生の設計図を完成させる',
      metaphor: '🌟 北極星（統合）',
      questions: []
    }
  };

  const generateAIResponse = (userInput: string, phase: string, questionIndex: number) => {
    const currentPhaseInfo = phaseInfo[phase as keyof typeof phaseInfo];
    
    if (phase === 'synthesis') {
      return `完璧です！全ての要素が揃いました。\n\nこれから、あなたの「北極星」を統合して、人生の設計図を作成します。\n\n少し時間をいただいて、AI分析を行います...`;
    }
    
    if (questionIndex < currentPhaseInfo.questions.length - 1) {
      return `素晴らしい洞察です！${currentPhaseInfo.metaphor}の設計が進んでいます。\n\n次の質問です：\n\n${currentPhaseInfo.questions[questionIndex + 1]}`;
    } else {
      // フェーズ完了
      const nextPhase = phase === 'values' ? 'ideal-self' : phase === 'ideal-self' ? 'final-goals' : 'synthesis';
      setCurrentPhase(nextPhase as any);
      
      if (nextPhase === 'synthesis') {
        return `素晴らしい！${currentPhaseInfo.title}が完成しました。\n\nこれから、あなたの「北極星」を統合して、人生の設計図を作成します。\n\n少し時間をいただいて、AI分析を行います...`;
      } else {
        const nextPhaseInfo = phaseInfo[nextPhase as keyof typeof phaseInfo];
        return `素晴らしい！${currentPhaseInfo.title}が完成しました。\n\n次は、${nextPhaseInfo.title}に進みましょう。\n\n${nextPhaseInfo.metaphor}の設計を始めます：\n\n${nextPhaseInfo.questions[0]}`;
      }
    }
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentInput,
      sender: 'user',
      timestamp: new Date(),
      type: currentPhase
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentInput('');
    setIsTyping(true);

    // AI応答を生成
    setTimeout(() => {
      const aiResponse = generateAIResponse(currentInput, currentPhase, 0);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        type: currentPhase
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Star className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  北極星アトリエ
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  価値観と理想の自分を明確に二分する設計工房
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {phaseInfo[currentPhase].title}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {phaseInfo[currentPhase].metaphor}
                </div>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                {phaseInfo[currentPhase].icon}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(phaseInfo).map(([key, info]) => (
            <div
              key={key}
              className={`p-4 rounded-lg border-2 transition-all ${
                currentPhase === key
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {info.icon}
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {info.title}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
                {info.description}
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {info.metaphor}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="whitespace-pre-wrap">{message.text}</div>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <AIInput>
            <AIInputTextarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="あなたの価値観や理想について深く考えて、正直にお答えください..."
              className="min-h-[60px] resize-none"
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton>
                  <Plus className="h-4 w-4" />
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit onClick={handleSendMessage} disabled={!currentInput.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </AIInputSubmit>
            </AIInputToolbar>
          </AIInput>
        </div>
      </div>
    </div>
  );
} 