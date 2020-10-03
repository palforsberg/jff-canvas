import { View } from '../src/main.js'
import RectangleView from './RectangleView.js'
import ResizeView from './ResizeView.js'

export default class LayoutView extends View {
    constructor(frame) {
        super(frame)
        this.setActive = this.setActive.bind(this)
        this.onMousedown = this.onMousedown.bind(this)
        this.onMousemove = this.onMousemove.bind(this)

        this.backgroundColor = '#DDD'
        this.resizeView = new ResizeView({ x: 0, y: 0, width: 0, height: 0 })
        this.addSubview(this.resizeView)
        this.resizeView.delegate = frame => {
            if (this.active) {
                this.active.frame = { ...frame }
            }
        }

        this.setActive(undefined)
    }

    setActive(view) {
        this.active = view
        this.resizeView.hidden = view == undefined
        if (!this.resizeView.hidden) {
            this.resizeView.setResizeArea(view.frame)
            this.resizeView.removeFromSuperview()
            this.addSubview(this.resizeView)
            this.resizeView.placeHandles()
        }
    }

    onMousedown(e) {
        e.preventDefault()
        const newView = new RectangleView({ x: e.point.x, y: e.point.y, width: 3, height: 3 })
        const randColor = () => Math.random() * 255
        newView.backgroundColor = `rgb(${randColor()}, ${randColor()}, ${randColor()})`
        newView.onMousedown = e => {
            this.setActive(newView)
            e.preventDefault()
        }
        this.addSubview(newView)
        this.setActive(newView)

        return this.onMousemove(newView)
    }

    onMousemove(view) {
        return (e, mouseUp) => {
            const point = this.getPointInView(e.layerX, e.layerY)
            view.frame.width = Math.abs(e.delta.x)
            view.frame.height = Math.abs(e.delta.y)
            if (e.delta.x < 0) {
                view.frame.x = point.x
            }
            if (e.delta.y < 0) {
                view.frame.y = point.y
            }

            this.resizeView.setResizeArea(view.frame)
            this.resizeView.placeHandles()

            this.repaint()

            if (mouseUp && (view.frame.height < 2 || view.frame.width < 2)) {
                view.removeFromSuperview()
                this.setActive(undefined)
            }
        }
    }
}