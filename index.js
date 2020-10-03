
import { Canvas, View, Button } from './src/main.js'
import ParticleView from './examples/ParticleView.js'
import ConfettiView from './examples/ConfettiView.js'
import Blob from './examples/Blob.js'
import LayoutView from './examples/LayoutView.js'
import Label from './src/Label.js'

const canvas = new Canvas('canvas', 'auto')

const title = new Label({ x: 10, y: 10, width: 200, height: 50 })
title.font = '26px Helvetica'
title.text = 'Animations'
title.align = 'start'
canvas.rootview.addSubview(title)

const cursor = { down: false }

const addConfeffi = (v, e) => {
    const point = v.getPointInView(e.layerX, e.layerY)
    const size = 30
    const confetti = new ConfettiView({ x: point.x - size / 2, y: point.y - size / 2, width: size, height: size })
    v.addSubview(confetti)
    confetti.startAnimation()
}

const addParticle = (v, e) => {
    const point = v.getPointInView(e.layerX, e.layerY)
    const add = () => {
        const dx = (Math.random() * 500) - 250
        const dy = 1 // (Math.random() * 1000) - 500
        const speedDelta = Math.random() * 1000
        const size = 6
        const frame = { x: point.x - size / 2, y: point.y - size / 2, width: size, height: size }
        const particle = new ParticleView(frame)
        v.addSubview(particle)
        particle.animateFrame({ ...frame, x: frame.x + dx, y: canvas.rootview.frame.height + dy }, 500 + speedDelta)
    }
    for (let i = 0, len = 20; i < len; i++) {
        add()
    }
}

canvas.rootview.onMousedown = (e) => {
    cursor.down = true
    document.addEventListener('mousemove', onMousemove)
    document.addEventListener('mouseup', onMouseup)
    
    addConfeffi(canvas.rootview, e)
}
function onMousemove(e) {
    if (cursor.down) {
        addConfeffi(canvas.rootview, e)
    }
}
function onMouseup(e) {
    cursor.down = false
    document.removeEventListener('mousemove', onMousemove)
    document.removeEventListener('mouseup', onMouseup)
}

const blob = new Blob({ x: 100, y: 70, width: 100, height: 100 })
canvas.rootview.addSubview(blob)

const layoutView = new LayoutView({ x: 0, y: 250, width: canvas.rootview.frame.width, height: 400 })
canvas.rootview.addSubview(layoutView)

const title2 = new Label({ x: 10, y: 10, width: 200, height: 50 })
title2.font = '26px Helvetica'
title2.text = 'Layout'
title2.align = 'start'
layoutView.addSubview(title2)
