import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

interface Message {
  id: string;
  text: string;
  sender: 'ai' | 'user';
  timestamp: Date;
}

interface AIOnboardingProps {
  onComplete: () => void;
}

export function AIOnboarding({ onComplete }: AIOnboardingProps) {
  const { updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'こんにちは！私はあなた専属のAIコーチです。これから10分程度のお時間をいただき、あなたの価値観や理想像について対話させていただきます。まず、人生で最も大切にしたい価値観を3つ教えていただけますか？',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const aiResponses = {
    1: (userInput: string) => `「${userInput}」という価値観をお持ちなのですね。素晴らしいです。次に、5年後のあなたはどのような状況にいると充実感を感じるでしょうか？仕事、プライベート、成長など、どの側面でも構いません。`,
    2: (userInput: string) => `とても具体的なビジョンをお持ちですね。「${userInput}」という理想に向かって歩んでいく姿が目に浮かびます。では、現在の状況と理想とのギャップで、最も重要だと感じる課題は何でしょうか？`,
    3: (userInput: string) => `なるほど、「${userInput}」が現在の主な課題なのですね。では、この課題を解決するために、まず今年中に達成したい具体的な目標を1つ教えてください。`,
    4: () => `ありがとうございます。これまでのお話から、あなたの将来設計の草案を作成いたします。この内容をもとに、具体的な目標とタスクを設定していきましょう。`
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
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: typeof aiResponse === 'function' ? aiResponse(currentInput) : aiResponse(),
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);

      if (step >= 4) {
        // Complete onboarding after final message
        setTimeout(() => {
          updateUser({ 
            hasCompletedOnboarding: true,
            futureVision: 'グローバルに活躍するエンジニアになる',
            coreValues: ['学習', '成長', '貢献']
          });
          onComplete();
        }, 2000);
      } else {
        setStep(prev => prev + 1);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
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
          
          {/* Progress indicator */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>進捗</span>
              <span>{step}/4</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(step / 4) * 100}%` }}
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
                  <p className="text-sm leading-relaxed">{message.text}</p>
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
          <div className="flex space-x-2 sm:space-x-4">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="メッセージを入力してください..."
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base"
              disabled={isTyping}
            />
            <button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="h-4 w-4" />
              <span className="hidden sm:inline">送信</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}