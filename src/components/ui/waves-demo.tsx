import React from 'react'
import { Waves } from './waves-background'
import { useTheme } from '../../contexts/ThemeContext'

export function WavesDemo() {
  const { theme } = useTheme()
  
  return (
    <div className="relative w-full h-[500px] bg-background/80 rounded-lg overflow-hidden">
      <div className="absolute inset-0">
        <Waves
          lineColor={theme === "dark" ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)"}
          backgroundColor="transparent"
          waveSpeedX={0.015}
          waveSpeedY={0.008}
          waveAmpX={50}
          waveAmpY={25}
          friction={0.92}
          tension={0.008}
          maxCursorMove={150}
          xGap={15}
          yGap={40}
        />
      </div>

      <div className="relative z-10 p-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Interactive Waves</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Move your mouse to interact with the waves</p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          <p>• マウスを動かすと波が反応します</p>
          <p>• タッチデバイスでも操作可能です</p>
          <p>• リアルタイムでアニメーションします</p>
        </div>
      </div>
    </div>
  )
} 