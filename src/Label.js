import View from './View.js'

export default class Label extends View {
   constructor(frame) {
      super(frame)
      this.text = 'Text'
      this.align = 'center'
      this.textColor = 'black'
      this.font = '14px Helvetica'
      this.clickable = false
   }
   paint(canvas) {
      if (!this.text) {
         return
      }
      canvas.setFont(this.font)
      canvas.drawText(0, 20, this.text, this.align, this.textColor)
   }
}
