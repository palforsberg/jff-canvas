# jff-canvas
View framework for HTML canvas

## Basics

Adding a simple view
```javascript
const canvas = new Canvas('canvas')

const view = new View({ x: 10, y: 10, width: 50, height: 50 })
view.backgroundColor = 'red'
canvas.rootview.addSubview(view)
```

Custom view

```javascript
class CustomView extends View {
    constructor(frame) {
        super(frame)
    }

    viewDidAppear() {
        console.log('viewDidAppear')
    }
    viewDidDisappear() {
        console.log('viewDidDisappear')
    }  
    paint(canvas) {
        console.log('paint')
    }
}
```

## Rendering
Basic stuff like background-color, stroke-color is rendered by default. More complex stuff can be handled manually in the `paint(canvas)` function. The canvas parameter is the Canvas object the view is inside of. The Canvas object as a ctx field which is the 2d-context of the canvas which can be used for full control over the rendering of the view. 
```javascript
class CustomView extends View {
    constructor(frame) {
        super(frame)
    }
    paint(canvas) {
        canvas.paintRect(this.frame.x + 10, this.frame.y + 10, this.frame.width - 20, this.frame.height - 20, 'red')

        canvas.ctx.beginPath()
        ...
    }
}
```

## Event handling
The `onMousedown(event)` function is called whenever a click is registered on the view. The event parameter is a normal javascript mouse-event with a point attribute added, which contains the x and y coordinates of the event inside the view.

A function can be returned which is then called when the mouse moves and the button is still clicked. The last time the function is called is on the `mouseup` event. `delta` and `moveDelta` attributes are added to the event in htis case to show the total moved delta since mousedown and the delta since the last mousemove event. 

`Event.preventDefault()` can still be used if the onMousedown function should not be triggered on no other views after this view has process the click. 

The views are processed depth-first and only considered if the event is inside all parent-frames.
```javascript
class CustomView extends View {
    constructor(frame) {
        super(frame)
    }
    onMousedown(downEvent) {
        console.log('mouse down on ', downEvent.point)

        return (moveEvent, mouseUp) => {
            if (!mouseUp) {
                console.log('mouse moved ', moveEvent.delta)
            } else {
                console.log('mouse up ', moveEvent.delta)
            }
        }
    }
}
```

## Animations

A animate function is available on all View-objects. The signature is `animate(duration, animation, onComplete, loop, easing)`. 
The duration is the total-duration in ms of the animation. 
animation: a function that take a progress parameter that goes from 0 -> 1. 
onComplete: function that is called once the animation has run the full duration and animation function been called with a 1.
loop: boolean wheter the animation should loop or not. 
easing: a function that take a value 0 -> 1 and returns a value that should be passed instead to animation.

View.stopAnimation can be used to stop a ongoing animation.

```javascript
const canvas = new Canvas('canvas')

const view = new View({ x: 10, y: 10, width: 50, height: 50 })
view.backgroundColor = 'red'
canvas.rootview.addSubview(view)

view.animate(500, p => {
    view.frame.x = 10 + 100 * p
}, () => {
    console.log('complete')
}, false, Ease.EaseOut)
```

The animation-parameter can be used together with the `paint` to enable advanced animations.
