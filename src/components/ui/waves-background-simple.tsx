import { useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface WavesProps {
  lineColor?: string
  backgroundColor?: string
  waveSpeedX?: number
  waveSpeedY?: number
  waveAmpX?: number
  waveAmpY?: number
  xGap?: number
  yGap?: number
  friction?: number
  tension?: number
  maxCursorMove?: number
  className?: string
}

export function Waves({
  lineColor = "hsl(var(--foreground))",
  backgroundColor = "transparent",
  waveSpeedX = 0.0125,
  waveSpeedY = 0.005,
  waveAmpX = 32,
  waveAmpY = 16,
  xGap = 10,
  yGap = 32,
  friction = 0.925,
  tension = 0.005,
  maxCursorMove = 100,
  className,
}: WavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    
    if (!canvas || !container) return
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    function resize() {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    function animate() {
      time += 0.01
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.strokeStyle = lineColor
      ctx.lineWidth = 1
      
      // Draw simple animated waves
      for (let x = 0; x < canvas.width; x += xGap) {
        ctx.beginPath()
        for (let y = 0; y < canvas.height; y += 2) {
          const waveX = x + Math.sin(y * 0.01 + time * waveSpeedX) * waveAmpX
          const waveY = y + Math.cos(x * 0.01 + time * waveSpeedY) * waveAmpY
          
          if (y === 0) {
            ctx.moveTo(waveX, waveY)
          } else {
            ctx.lineTo(waveX, waveY)
          }
        }
        ctx.stroke()
      }
      
      animationId = requestAnimationFrame(animate)
    }

    resize()
    animate()

    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [lineColor, backgroundColor, waveSpeedX, waveSpeedY, waveAmpX, waveAmpY, xGap, yGap, friction, tension, maxCursorMove])

  return (
    <div
      ref={containerRef}
      style={{ backgroundColor }}
      className={cn("absolute top-0 left-0 w-full h-full overflow-hidden", className)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
} 