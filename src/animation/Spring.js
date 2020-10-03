
const spring = (deceleration = 0.2, springConstant = 4, mass = 50) => {
    let velocity = 0
    let p = 0
    const endP = 1
    const pos = []

    do {
        const springForce = -(p - endP) * springConstant
        const acc = springForce / mass
        velocity += acc
        p += velocity

        pos.push(p)
        velocity *= deceleration
    } while (Math.abs(p - endP) > 0.0001 || Math.abs(velocity) > 0.0001)

    const len = pos.length

    return (t) => pos[Math.floor(t * (len - 1))]
}

export default spring


