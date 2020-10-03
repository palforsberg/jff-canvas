import { View } from "../src/main.js"

const HANDLE_SIZE = 8
export default class ResizeView extends View {
    constructor(frame) {
        super(frame)
        this.placeHandles = this.placeHandles.bind(this)
        this.onMousedownOnView = this.onMousedownOnView.bind(this)
        this.onMoveView = this.onMoveView.bind(this)
        this.onMousedownOnHandle = this.onMousedownOnHandle.bind(this)
        this.onMoveHandle = this.onMoveHandle.bind(this)
        
        this.onMousedown = this.onMousedownOnView
        this.delegate = () => {}

        this.handles = []
        const addHandle = (index) => {
            const handle = new View({ x: 0, y: 0, width: HANDLE_SIZE, height: HANDLE_SIZE })
            handle.strokeColor = 'blue'
            handle.backgroundColor = 'white'

            this.addSubview(handle)
            handle.onMousedown = e => this.onMousedownOnHandle(e, index)
            this.handles.push(handle)
        }
        addHandle(0)
        addHandle(1)
        addHandle(2)
        addHandle(3)   
    }

    setResizeArea(frame) {
        this.frame = this.getFrameFromResizeArea(frame)
    }

    placeHandles() {
        const moveHandle = (i, point) => {
            const h = this.handles[i]
            h.frame.x = point.x
            h.frame.y = point.y
        }
        moveHandle(0, { x: this.frame.width - HANDLE_SIZE, y: 0 })
        moveHandle(1, { x: this.frame.width - HANDLE_SIZE, y: this.frame.height - HANDLE_SIZE })
        moveHandle(2, { x: 0, y: this.frame.height - HANDLE_SIZE })
        moveHandle(3, { x: 0, y: 0 })
    }

    onMousedownOnView(e) {
        e.preventDefault()

        return this.onMoveView
    }
    onMoveView(e) {
        this.frame.x += e.moveDelta.x
        this.frame.y += e.moveDelta.y
        this.delegate(this.getResizeAreaFrame())
        this.placeHandles()
        this.repaint()
    }

    onMousedownOnHandle(e, index) {
        e.preventDefault()
        return e => this.onMoveHandle(e, index)
    }
    onMoveHandle(e, index) {
        const handlePoint = this.getPointForHandle(index)
        const movingPoint = { x: handlePoint.x + e.moveDelta.x, y: handlePoint.y + e.moveDelta.y }        
        const anchor = this.getPointForHandle((index + 2) % 4) // get point on opposite side, 2 points away

        this.frame.x = Math.min(anchor.x, movingPoint.x)
        this.frame.y = Math.min(anchor.y, movingPoint.y)
        this.frame.width = Math.abs(anchor.x - movingPoint.x)
        this.frame.height = Math.abs(anchor.y - movingPoint.y)

        this.delegate(this.getResizeAreaFrame())
        this.placeHandles()
        this.repaint()
    }

    paint(canvas) {
        const padding = HANDLE_SIZE / 2
        canvas.drawRect(padding, padding, this.frame.width - padding * 2, this.frame.height - padding * 2, 'blue')
    }

    getResizeAreaFrame() {
        return { 
            x: this.frame.x + HANDLE_SIZE / 2,
            y: this.frame.y + HANDLE_SIZE / 2,
            width: this.frame.width - HANDLE_SIZE,
            height: this.frame.height - HANDLE_SIZE,
        }
    }
    getFrameFromResizeArea(area) {
        return {
            x: area.x - HANDLE_SIZE / 2,
            y: area.y - HANDLE_SIZE / 2,
            width: area.width + HANDLE_SIZE ,
            height: area.height + HANDLE_SIZE
        }
    }

    getPointForHandle(index) {
        switch (index) {
            case 0: return { x: this.frame.x + this.frame.width, y: this.frame.y }
            case 1: return { x: this.frame.x + this.frame.width, y: this.frame.y + this.frame.height }
            case 2: return { x: this.frame.x, y: this.frame.y + this.frame.height }
            case 3: return { x: this.frame.x, y: this.frame.y }
        }
    }
}