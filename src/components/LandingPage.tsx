import React from 'react';
import { Compass, Target, TrendingUp, MessageCircle, CheckCircle, Users, Heart, Star, ArrowRight, Play, Quote } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Waves } from './ui/waves-background';
import { Footer } from './ui/footer';
import { Auth } from './ui/auth-form-1';
import { MoonIcon } from './ui/moon';
import { SunIcon } from './ui/sun';
import { GlassIcon } from './ui/glass-icon';
import { GlassFilter } from './ui/liquid-glass';

interface LandingPageProps {
  onGetStarted: () => void;
  onSkipOnboarding?: () => void;
}

export function LandingPage({ onGetStarted, onSkipOnboarding }: LandingPageProps) {
  const { theme, toggleTheme } = useTheme();

  const testimonials = [
    {
      name: "田中 美咲",
      role: "マーケティング部長, 32歳",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "Compassを使い始めて、キャリアの方向性が明確になりました。日々のタスクが将来の目標にどう繋がっているかが見えるようになり、モチベーションが格段に上がりました。",
      achievement: "3ヶ月で昇進、理想のワークライフバランスを実現"
    },
    {
      name: "佐藤 健太",
      role: "フリーランスエンジニア, 28歳", 
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "価値観の探索を通じて、本当にやりたい仕事が見つかりました。AIコーチが毎日の振り返りをサポートしてくれるので、着実に理想に近づいている実感があります。",
      achievement: "独立後6ヶ月で月収50%アップを達成"
    },
    {
      name: "山田 恵子",
      role: "人事コンサルタント, 35歳",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
      quote: "子育てと仕事の両立に悩んでいましたが、Compassで自分の価値観を整理できました。今は家族との時間も大切にしながら、キャリアも順調に発展しています。",
      achievement: "ワークライフバランス改善、家族満足度90%向上"
    }
  ];

  const features = [
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "AI対話式設計",
      description: "価値観や理想像を深掘りし、あなただけの将来設計を作成",
      detail: "15分の対話で、あなたの本当の価値観と理想の未来を明確化。単なる目標設定ではなく、心の奥底にある想いを言語化します。"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "階層的目標管理",
      description: "将来設計から日々のタスクまで、つながりを可視化",
      detail: "ビジョン→長期目標→中期目標→日々のタスクまで、すべての行動が理想実現にどう貢献するかを明確に表示します。"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "進捗可視化",
      description: "チャートやグラフで成長を実感できる",
      detail: "価値観実現度、目標達成率、時間効率性など、多角的な指標であなたの成長を定量化・可視化します。"
    },
    {
      icon: <Compass className="h-8 w-8" />,
      title: "パーソナル指針",
      description: "迷った時にも、あなたの価値観に基づいた提案",
      detail: "日々の選択に迷った時、AIがあなたの価値観と理想に基づいて最適な判断をサポートします。"
    }
  ];

  const painPoints = [
    {
      icon: "😔",
      title: "目標を立てても、三日坊主で終わってしまう",
      description: "やる気はあるのに、なぜか続かない。そんな経験はありませんか？"
    },
    {
      icon: "🤔", 
      title: "自分が本当にやりたいことが何なのか、わからない",
      description: "忙しい日々の中で、本当の自分を見失ってしまうことがあります。"
    },
    {
      icon: "😰",
      title: "日々のタスクに追われ、大きな目標を見失いがち",
      description: "目の前のことで精一杯で、人生の方向性が見えなくなっていませんか？"
    },
    {
      icon: "😕",
      title: "努力しているのに、成長している実感がない",
      description: "頑張っているつもりなのに、前に進んでいる感覚がない。"
    }
  ];

  const faqs = [
    {
      question: "料金はかかりますか？",
      answer: "基本機能は完全無料でご利用いただけます。より高度なAI分析や詳細なレポート機能をご希望の場合は、プレミアムプランもご用意しています。"
    },
    {
      question: "データは安全ですか？",
      answer: "はい、お客様のプライバシーとデータセキュリティを最優先に考えています。すべてのデータは暗号化され、厳格なセキュリティ基準に従って管理されています。"
    },
    {
      question: "どのくらいの時間で効果を実感できますか？",
      answer: "多くのユーザー様が1週間以内に目標の明確化を、1ヶ月以内に行動の変化を実感されています。継続的にご利用いただくことで、より大きな変化を感じていただけます。"
    },
    {
      question: "スマートフォンでも使えますか？",
      answer: "はい、スマートフォン、タブレット、PCなど、あらゆるデバイスで快適にご利用いただけるよう設計されています。"
    }
  ];

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <GlassFilter />
      
      {/* Hero Section - 現在のデザインを維持 */}
      <section className="relative min-h-screen">
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
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[80vh]">
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
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                      <GlassIcon className="flex-shrink-0">
                        {feature.icon}
                      </GlassIcon>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{feature.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Side - Auth Form */}
              <div className="w-full max-w-md mx-auto lg:max-w-none">
                <Auth />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="relative py-16 sm:py-24">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"}
            backgroundColor="transparent"
            waveSpeedX={0.01}
            waveSpeedY={0.006}
            waveAmpX={35}
            waveAmpY={20}
            friction={0.94}
            tension={0.005}
            maxCursorMove={100}
            xGap={18}
            yGap={40}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              こんな悩みを抱えていませんか？
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              多くの人が抱える、目標達成や自己実現に関する共通の課題があります
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {painPoints.map((point, index) => (
              <div key={index} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl sm:text-4xl">{point.icon}</div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {point.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-16 sm:py-24">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.12)"}
            backgroundColor="transparent"
            waveSpeedX={0.012}
            waveSpeedY={0.007}
            waveAmpX={40}
            waveAmpY={22}
            friction={0.93}
            tension={0.007}
            maxCursorMove={110}
            xGap={16}
            yGap={38}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Compassがその悩みを解決します
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              AIとの対話を通じて、あなたの価値観を明確にし、理想の実現への道筋を描きます
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center mb-16">
            {features.map((feature, index) => (
              <div key={index} className={`${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-4 mb-4">
                    <GlassIcon className="w-12 h-12">
                      {feature.icon}
                    </GlassIcon>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.detail}
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                    <span>詳しく見る</span>
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="relative py-16 sm:py-24 bg-gray-900 dark:bg-gray-800 text-white">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor="rgba(255, 255, 255, 0.08)"
            backgroundColor="transparent"
            waveSpeedX={0.008}
            waveSpeedY={0.004}
            waveAmpX={30}
            waveAmpY={18}
            friction={0.95}
            tension={0.004}
            maxCursorMove={90}
            xGap={20}
            yGap={45}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              なぜ私たちはCompassを作ったのか
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              単なるタスク管理ツールではない、人生のコンパスとなるサービスを作った理由
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <Heart className="h-8 w-8 text-red-400" />
                <h3 className="text-xl sm:text-2xl font-bold">私たちのビジョン</h3>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed">
                「誰もが自分の可能性を信じ、主体的に人生を歩める社会」
              </p>
              <p className="text-gray-300 leading-relaxed">
                現代社会では、多くの人が日々のタスクに追われ、本当に大切なことを見失いがちです。私たちは、AIの力を借りて一人ひとりの価値観を明確にし、理想の実現をサポートすることで、より充実した人生を送れる社会を目指しています。
              </p>
              <p className="text-gray-300 leading-relaxed">
                Compassは単なるツールではありません。あなたの人生の伴走者として、迷った時には方向を示し、達成した時には共に喜ぶ、そんな存在でありたいと考えています。
              </p>
            </div>
            <div className="relative bg-gray-800/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-700/50">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Star className="h-6 w-6 text-yellow-400" />
                  <span className="font-semibold">私たちの約束</span>
                </div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>あなたの価値観を最優先に考えます</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>プライバシーを厳格に保護します</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span>継続的な改善でサポートし続けます</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-16 sm:py-24">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.11)" : "rgba(0, 0, 0, 0.11)"}
            backgroundColor="transparent"
            waveSpeedX={0.013}
            waveSpeedY={0.008}
            waveAmpX={42}
            waveAmpY={24}
            friction={0.92}
            tension={0.006}
            maxCursorMove={115}
            xGap={17}
            yGap={36}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              お客様の声
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Compassを使って人生が変わった方々の実体験をご紹介します
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-4 mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
                <Quote className="h-6 w-6 text-gray-400 mb-3" />
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div className="bg-blue-50/80 dark:bg-blue-900/30 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50 dark:border-blue-800/50">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    📈 {testimonial.achievement}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 sm:py-24">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.09)"}
            backgroundColor="transparent"
            waveSpeedX={0.009}
            waveSpeedY={0.005}
            waveAmpX={32}
            waveAmpY={19}
            friction={0.96}
            tension={0.003}
            maxCursorMove={85}
            xGap={22}
            yGap={42}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              よくある質問
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Compassについてのご質問にお答えします
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Q. {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  A. {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative py-16 sm:py-24 bg-gray-900 dark:bg-gray-800 text-white">
        {/* Background Waves */}
        <div className="absolute inset-0 z-0">
          <Waves
            lineColor="rgba(255, 255, 255, 0.07)"
            backgroundColor="transparent"
            waveSpeedX={0.007}
            waveSpeedY={0.003}
            waveAmpX={28}
            waveAmpY={16}
            friction={0.97}
            tension={0.002}
            maxCursorMove={80}
            xGap={25}
            yGap={48}
          />
        </div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            あなたの人生のコンパスを見つけませんか？
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            15分の対話で、あなたの価値観と理想の未来を明確にし、実現への第一歩を踏み出しましょう。
          </p>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={onGetStarted}
              className="relative w-full sm:w-auto bg-white/90 backdrop-blur-sm text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white transition-colors flex items-center justify-center space-x-2 shadow-lg border border-white/20"
            >
              <span>無料で始める</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button className="relative w-full sm:w-auto border border-gray-600/50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800/50 transition-colors flex items-center justify-center space-x-2">
              <Play className="h-5 w-5" />
              <span>デモを見る</span>
            </button>
          </div>
          
          {/* Development Skip Button */}
          {onSkipOnboarding && (
            <div className="mt-8 pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-3">開発用：オンボーディングをスキップ</p>
              <button
                onClick={onSkipOnboarding}
                className="relative w-full sm:w-auto bg-red-600/80 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium text-sm hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <span>スキップしてダッシュボードへ</span>
              </button>
            </div>
          )}

          <p className="text-sm text-gray-400 mt-6">
            クレジットカード不要 • 3分で登録完了 • いつでも退会可能
          </p>
        </div>
      </section>
      
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