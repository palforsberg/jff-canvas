import View from './View.js'
import Label from './Label.js'

export default class Button extends View {
    constructor(frame) {
        super(frame)
        this.onMousedown = this.onMousedown.bind(this)
        this.onMouseup = this.onMouseup.bind(this)
        this.backgroundColor = '#AAA'
        this.activeColor = '#888'
        this.label = new Label({ ...frame, x: 0, y: 4 })
        this.label.text = 'Button'
        this.label.align = 'center'
        this.addSubview(this.label)
        this.onClick = () => { }
    }
    
    onMousedown(event) {
        this._backgroundColor = this.backgroundColor
        this.backgroundColor = '#888'
        document.addEventListener('mouseup', this.onMouseup)
        event.preventDefault()
    }

    onMouseup(event) {
        event.point = this.getPointInView(event.layerX, event.layerY)
        this.onClick(event)
        this.backgroundColor = this._backgroundColor
        document.removeEventListener('mouseup', this.onMouseup)
    }
}