"use client"

import { useEffect, useRef } from "react"

export function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        let animationFrameId: number
        let mouseX = -1000
        let mouseY = -1000

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            const spacing = 30
            const rows = Math.ceil(canvas.height / spacing)
            const cols = Math.ceil(canvas.width / spacing)

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    const x = j * spacing
                    const y = i * spacing

                    const dx = mouseX - x
                    const dy = mouseY - y
                    const distance = Math.sqrt(dx * dx + dy * dy)
                    const maxDistance = 150

                    let size = 1.5
                    let alpha = 0.1

                    if (distance < maxDistance) {
                        const factor = (maxDistance - distance) / maxDistance
                        size = 1.5 + factor * 2
                        alpha = 0.1 + factor * 0.4
                    }

                    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
                    ctx.beginPath()
                    ctx.arc(x, y, size, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            animationFrameId = requestAnimationFrame(draw)
        }

        resize()
        window.addEventListener("resize", resize)
        window.addEventListener("mousemove", handleMouseMove)
        draw()

        return () => {
            window.removeEventListener("resize", resize)
            window.removeEventListener("mousemove", handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-0 h-full w-full"
        />
    )
}
