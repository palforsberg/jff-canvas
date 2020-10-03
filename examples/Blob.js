import { Ease, View, BlinkBezier } from '../src/main.js'

export default class Blob extends View {
    constructor(frame) {
        super(frame)
        this.onMousedown = this.onMousedown.bind(this)
        this.onMousemove = this.onMousemove.bind(this)
        this.onMouseup = this.onMouseup.bind(this)
        this.dx = 0
        this.dy = 0

       this.cursor = { x: 0, y: 0, down: false }

       this.points = []
       const r = frame.width / 2
        for (let i = 0, len = 60; i <= len; i++) {
            const a = (i / len) * 2 * ( Math.PI )
            const x = (this.frame.width / 2) + 1 + r * Math.cos(a)
            const y = (this.frame.height / 2) + 1 + r * Math.sin(a)
            this.points.push({ x, y })
        }
    }

    onMousedown(event) {
        this.cursor = { ...event.point, down: true }
        document.addEventListener('mousemove', this.onMousemove)
        document.addEventListener('mouseup', this.onMouseup)
        this.stopAnimation()
        event.preventDefault()
    }
    onMousemove(event) {
        const point = this.getPointInView(event.layerX, event.layerY)
        this.dx = this.dx + point.x - this.cursor.x
        this.dy = this.dy + point.y - this.cursor.y
        this.cursor = { ...this.cursor, ...point }
        this.repaint()

        if (Math.sqrt(this.dx**2 + this.dy**2) > 250) {
            this.dx = Math.max(-250, Math.min(250, this.dx))
            this.onMouseup(event)
        }
    }
    onMouseup(event) {
        this.cursor = { ...event.point, down: false }
        document.removeEventListener('mousemove', this.onMousemove)
        document.removeEventListener('mouseup', this.onMouseup)
        const dx = this.dx
        const dy = this.dy
        this.animate(1000, p => {
            this.dx = dx * (1 - p)
            this.dy = dy * (1 - p)
        }, () => {
            this.dx = 0
            this.dy = 0
        }, false, Ease.Bounce(0.65, 8, 50))
    }
    paint2(canvas) {
        const pi = Math.PI
        const ctx = canvas.ctx
        ctx.beginPath();
        ctx.fillStyle = 'blue'
        
        const p0x = this.dx * 0.1
        const p0y = Math.abs(this.dx) * 0.1
        
        const p1x = this.dx * (this.dx > 0 ? 0.5 : 0.1)
        const p1y = 0 // this.dy
        
        const p2x = this.dx * 0.1
        const p2y = -Math.abs(this.dx) * 0.1

        const p3x = this.dx * (this.dx < 0 ? 0.5 : 0.1)
        const p3y = 0 // this.dy

        const p0 = { x: this.frame.width / 2 + p0x, y: + p0y}
        const p1 = { x: this.frame.width + p1x, y: this.frame.height / 2 + p1y}
        const p2 = { x: this.frame.width / 2 + p2x, y: this.frame.height + p2y}
        const p3 = { x: 0 + p3x, y: this.frame.height / 2 + p3y}

        const drawCircle = (start, end, cp1, cp2) => {
            ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y); 
        }
        ctx.moveTo(p0.x, p0.y)
        drawCircle(p0, p1, { x: p0.x + 28, y: p0.y }, { x: p1.x, y: p1.y - 28 })
        drawCircle(p1, p2, { x: p1.x, y: p1.y + 28 }, { x: p2.x + 28, y: p2.y })
        drawCircle(p2, p3, { x: p2.x - 28, y: p2.y }, { x: p3.x, y: p3.y + 28 })
        drawCircle(p3, p0, { x: p3.x, y: p3.y - 28 }, { x: p0.x - 28, y: p0.y })
        ctx.fill();
    }

    static bezier = new BlinkBezier(0.8, .0, .5, 1)
    paint(canvas) {
        const ctx = canvas.ctx
        const middle = { x: this.frame.width / 2, y: this.frame.height / 2 }
        const r = this.frame.width / 2
        const vector = { x: this.dx, y: this.dy }
        const vectorAngle = Math.atan2(vector.y, vector.x)
        const pointOnCircle = {
            x: middle.x + r * Math.cos(vectorAngle),
            y: middle.y + r * Math.sin(vectorAngle)
        }

        const pointTop = {
            x: middle.x + r * Math.cos(vectorAngle + (Math.PI/2)),
            y: middle.y + r * Math.sin(vectorAngle + (Math.PI/2))
        }
        const vectorMiddleTop = { x: middle.x - pointTop.x, y: middle.y - pointTop.y }

        const pointBottom = {
            x: middle.x + r * Math.cos(vectorAngle - (Math.PI/2)),
            y: middle.y + r * Math.sin(vectorAngle - (Math.PI/2))
        }
        const vectorMiddleBottom = { x: middle.x - pointBottom.x, y: middle.y - pointBottom.y }
        
        const magnitude = Math.sqrt(vector.x**2 + vector.y**2)
        // const normalizedVector = { x: vector.x / magnitude, y: vector.y / magnitude }

        // ctx.beginPath();
        // canvas.drawLineTo(r, r, vector.x + r, vector.y + r)
        // ctx.stroke()
        // canvas.paintCircle(pointOnCircle.x, pointOnCircle.y, 5, 'black')
        ctx.beginPath();
        ctx.fillStyle = 'blue'
        this.points.forEach(p => {
            const dist = Math.sqrt((pointOnCircle.x - p.x)**2 + (pointOnCircle.y - p.y)**2)
            const force = 1 - (dist / 100)
            const eased = Blob.bezier.solve(force) * 0.4

            const distTop = Math.sqrt((pointTop.x - p.x)**2 + (pointTop.y - p.y)**2)
            const distBottom = Math.sqrt((pointBottom.x - p.x)**2 + (pointBottom.y - p.y)**2)
            
            const forceTop = (1 - (distTop / 100)**2) * magnitude * 0.001
            const forceBottom = (1 - (distBottom / 100)**2) * magnitude * 0.001
            
            // canvas.paintCircle(
            //     p.x + vector.x * eased + vectorMiddleTop.x * forceTop + vectorMiddleBottom.x * forceBottom,
            //     p.y + vector.y * eased + vectorMiddleTop.y * forceTop + vectorMiddleBottom.y * forceBottom,
            //     5, `rgba(0,0,0,${force})`)

            ctx.lineTo(
                p.x + vector.x * eased + vectorMiddleTop.x * forceTop + vectorMiddleBottom.x * forceBottom,
                p.y + vector.y * eased + vectorMiddleTop.y * forceTop + vectorMiddleBottom.y * forceBottom
            )
        })
        ctx.fill();
    }
}