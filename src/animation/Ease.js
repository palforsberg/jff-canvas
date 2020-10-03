import BlinkBezier from './BlinkBezier.js'
import bounce from './Bounce.js'
import spring from './Spring.js'

const inOut = new BlinkBezier(0.63, 1, 0.43, 0.9)
const out = new BlinkBezier(0, 0, 0.4, 1)
const _in = new BlinkBezier(0.6, 0, 1, 1)

export const EaseInOut = t => inOut.solve(t)
export const EaseOut = t => out.solve(t)
export const EaseIn = t => _in.solve(t)
export const Linear = t => t

export const Spring = (dec, springc, mass) => {
    const func = spring(dec, springc, mass)
    return t => func(t)
}

export const Bounce = (dec, springc, mass) => {
    const func = bounce(dec, springc, mass)
    return t => func(t)
}