import React from 'react';
import { Compass, Target, TrendingUp, MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Waves } from './ui/waves-background';
import { Footer } from './ui/footer';
import { Auth } from './ui/auth-form-1';
import { MoonIcon } from './ui/moon';
import { SunIcon } from './ui/sun';
import { GlassIcon } from './ui/glass-icon';
import { GlassInput } from './ui/glass-input';
import { GlassFilter } from './ui/liquid-glass';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <GlassFilter />
      {/* Background Waves */}
      <div className="absolute inset-0 z-0">
        <Waves
          lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.15)"}
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.008}
          waveAmpX={45}
          waveAmpY={25}
          friction={0.92}
          tension={0.006}
          maxCursorMove={120}
          xGap={15}
          yGap={35}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-4 sm:px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="h-6 w-6 sm:h-8 sm:w-8 text-gray-900 dark:text-white" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Compass</span>
            </div>
            {theme === 'light' ? (
              <MoonIcon 
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              />
            ) : (
              <SunIcon 
                onClick={toggleTheme}
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              />
            )}
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                  人生のコンパスとなる
                  <br />
                  <span className="text-gray-600 dark:text-gray-300">AIコーチング</span>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  「なぜそれをやるのか」を常に意識しながら、AIとの対話を通じて理想の自分へと導きます。目標設定から日々のタスクまで、一気通貫でサポートします。
                </p>
              </div>

              {/* Features */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <GlassIcon className="flex-shrink-0">
                    <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
                  </GlassIcon>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">AI対話式設計</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">価値観や理想像を深掘りし、あなただけの将来設計を作成</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <GlassIcon className="flex-shrink-0">
                    <Target className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
                  </GlassIcon>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">階層的目標管理</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">将来設計から日々のタスクまで、つながりを可視化</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <GlassIcon className="flex-shrink-0">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
                  </GlassIcon>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">進捗可視化</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">チャートやグラフで成長を実感できる</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <GlassIcon className="flex-shrink-0">
                    <Compass className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 dark:text-gray-300" />
                  </GlassIcon>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">パーソナル指針</h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">迷った時にも、あなたの価値観に基づいた提案</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="w-full max-w-md mx-auto lg:max-w-none">
              <Auth />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer
        logo={<Compass className="h-10 w-10 text-gray-900 dark:text-white" />}
        brandName="Compass"
        socialLinks={[
          {
            icon: <MessageCircle className="h-5 w-5" />,
            href: "https://twitter.com",
            label: "Twitter",
          },
          {
            icon: <Target className="h-5 w-5" />,
            href: "https://github.com",
            label: "GitHub",
          },
          {
            icon: <TrendingUp className="h-5 w-5" />,
            href: "https://linkedin.com",
            label: "LinkedIn",
          },
        ]}
        mainLinks={[
          { href: "/features", label: "機能" },
          { href: "/about", label: "会社概要" },
          { href: "/blog", label: "ブログ" },
          { href: "/contact", label: "お問い合わせ" },
        ]}
        legalLinks={[
          { href: "/privacy", label: "プライバシーポリシー" },
          { href: "/terms", label: "利用規約" },
        ]}
        copyright={{
          text: "© 2024 Compass",
          license: "All rights reserved",
        }}
      />
    </div>
  );
}