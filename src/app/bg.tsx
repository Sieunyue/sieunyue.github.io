'use client'
import { MutableRefObject, useEffect, useRef } from "react"
import { nanoid } from 'nanoid'

type Point = {
  x: number
  y: number
}

const len = 8

interface ITwig {
  id: string
  ctx: CanvasRenderingContext2D,
  pos: Point
  len: number
  step: number
  dx: number
  dy: number
  theta: number
  draw: () => void
  getEndPoint: () => Point
  drawLine: (p1: Point, p2: Point) => void

}

class Twig implements ITwig {
  static iteration = 0
  static queen: ITwig[] = []
  static dirty: Set<string> = new Set()
  static width: number
  static height: number
  id: string
  pos: Point
  len: number
  step: number
  currentStep: number
  theta: number
  dx: number
  dy: number
  start: Point
  ctx: CanvasRenderingContext2D
  constructor(ctx: CanvasRenderingContext2D, x: number, y: number, theta: number) {
    this.id = nanoid()
    this.ctx = ctx
    this.start = { x, y }
    this.pos = { x, y }
    this.theta = theta
    this.len = 5
    this.step = 6
    this.currentStep = 0
    const end = this.getEndPoint()

    this.dx = (end.x - this.pos.x) / this.step
    this.dy = (end.y - this.pos.y) / this.step
  }


  getEndPoint(): Point {
    return {
      x: this.pos.x + this.len * Math.cos(this.theta), y: this.pos.y + this.len * Math.sin(this.theta)
    }
  }

  draw() {
    if (this.currentStep < this.step) {
      this.currentStep++

      const nextX = this.pos.x + this.dx
      const nextY = this.pos.y + this.dy

      this.drawLine(this.pos, { x: nextX, y: nextY })
      this.pos.x = nextX
      this.pos.y = nextY

    }

    if (this.currentStep === this.step) {
      Twig.dirty.add(this.id)

      const { x, y } = this.pos

      if (x > Twig.width || x < 0 || y > Twig.height || y < 0) return

      if (Math.random() < 0.5 || Twig.iteration < 5 * this.step) {
        Twig.queen.push(new Twig(this.ctx, x, y, this.theta + Math.random() * Math.PI / 12))
      }
      if (Math.random() < 0.5 || Twig.iteration < 5 * this.step) {
        Twig.queen.push(new Twig(this.ctx, x, y, this.theta - Math.random() * Math.PI / 12))
      }

    }
  }

  drawLine(p1: Point, p2: Point) {
    this.ctx.beginPath()
    this.ctx.strokeStyle! = 'rgba(221, 221, 221, 0.45)'
    this.ctx.moveTo(p1.x, p1.y)
    this.ctx.lineTo(p2.x, p2.y)
    this.ctx.stroke()
  }
}


const BackgroundCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>() as MutableRefObject<HTMLCanvasElement>

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      const { width, height } = canvasRef.current.getBoundingClientRect()
      const { devicePixelRatio } = window
      canvasRef.current.height = height * devicePixelRatio
      canvasRef.current.width = width * devicePixelRatio

      Twig.height = canvasRef.current.height
      Twig.width = canvasRef.current.width

      if (ctx) {
        Twig.queen.push(new Twig(ctx, canvasRef.current.width * Math.random(), 0, Math.PI / 2))
        Twig.queen.push(new Twig(ctx, canvasRef.current.width * Math.random(), canvasRef.current.height, -Math.PI / 2))
        Twig.queen.push(new Twig(ctx, 0, canvasRef.current.height * Math.random(), 0))
        Twig.queen.push(new Twig(ctx, canvasRef.current.width, canvasRef.current.height * Math.random(), -Math.PI))

        const startFrame = () => {
          requestAnimationFrame(() => {
            Twig.queen.forEach(t => t.draw())
            Twig.queen = Twig.queen.filter(o => !Twig.dirty.has(o.id))

            Twig.dirty.clear()
            Twig.iteration++;

            if (Twig.queen.length !== 0) {
              startFrame()
            }

          })
        }

        startFrame()
      }
    }
  }, [])

  return (
    <canvas ref={canvasRef} className="w-screen h-screen -z-10 pointer-events-none fixed left-0 top-0">

    </canvas>
  )
}

export default BackgroundCanvas