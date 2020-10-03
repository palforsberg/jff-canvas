import { Ease, View } from '../src/main.js'

export default class ParticleView extends View {
    constructor(frame) {
        super(frame)
        this.fall = this.fall.bind(this)
        this.setProgress = this.setProgress.bind(this)
        this.animateFrame = this.animateFrame.bind(this)
        this.getBackgroundColor = this.getBackgroundColor.bind(this)
        this.backgroundColor = this.getBackgroundColor(0)
    }

    fall(duration = 500) {
        this.animate(duration, this.setProgress, () => this.removeFromSuperview(), false, Ease.EaseIn)
        this.startY = this.frame.y
    }
    setProgress(progress, canvas) {
       this.frame.y = this.startY + 1000 * progress
    }

    getBackgroundColor(p) {
        return `rgba(${255 * (1-p) / 1},0,180, 0.7)`
    }
    animateFrame(newFrame, duration) {
        const diff = {
            x: newFrame.x - this.frame.x,
            y: newFrame.y - this.frame.y,
            width: newFrame.width - this.frame.width,
            height: newFrame.height - this.frame.height,
        }
        const start = { ...this.frame }
        this.animate(duration, p => {
            this.backgroundColor = this.getBackgroundColor(p)
            this.frame.x = start.x + diff.x * p
            this.frame.y = start.y + diff.y * p
            this.frame.width = start.width + diff.width * p
            this.frame.height = start.height + diff.height * p
        }, () => this.removeFromSuperview(), false, Ease.Linear)
    }
}