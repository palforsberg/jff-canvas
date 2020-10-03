import { Ease, View } from '../src/main.js'

export default class ConfettiView extends View {
   constructor(frame) {
      super(frame)
      this.setProgress = this.setProgress.bind(this)
      this.duration = 500
      this.nrLoops = 0
   }

   startAnimation(duration = 500) {
      this.animate(duration, this.setProgress, () => this.removeFromSuperview(), false, Ease.EaseInOut)
   }
   setProgress(progress, canvas) {
      const color = `rgba(${255 * progress / 1},0,180, 1)`
      canvas.beginLine(color, 2, 'round')
      const k = this.frame.width
      const l1 = k * progress ** 4
      const l2 = k * progress ** 2
      const middle = { x: this.frame.width / 2, y: this.frame.height / 2 }

      const rand = (Math.random() * 0.6) - 0.3
      for (let i = 0, len = 20; i < len; i++) {
         canvas.drawLine(middle.x, middle.y, l1, l2, (i + rand)/ len * 360)
      }
      canvas.endLine()
   }
}
