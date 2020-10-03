

export default class BlinkBezier {
    constructor(p1x, p1y, p2x, p2y) {
        this.cx = 3.0 * p1x
        this.bx = 3.0 * (p2x - p1x) - this.cx
        this.ax = 1.0 - this.cx - this.bx

        this.cy = 3.0 * p1y
        this.by = 3.0 * (p2y - p1y) - this.cy
        this.ay = 1.0 - this.cy - this.by

        this.m_startGradient = 0
        if (p1x > 0) {
            this.m_startGradient = p1y/p1x
        } else if (!p1y && p2x > 0) {
            this.m_startGradient = p2y / p2x
        }

        this.m_endGradient = 0
        if (p2x < 1) {
            this.m_endGradient = (p2y - 1) / (p2x - 1)
        } else if (p2x == 1 && p1x < 1) {
            this.m_endGradient = (p1y - 1) / (p1x - 1)
        }
    }

    sampleCurveX(t) {
        return ((this.ax * t + this.bx) * t + this.cx) * t
    }

    sampleCurveY(t) {
        return ((this.ay * t + this.by) * t + this.cy) * t
    }

    sampleCurveDerivativeX(t) {
        return (3.0 * this.ax * t + 2.0 * this.bx) * t + this.cx
    }

    solveCurveX(x, epsilon) {

        let t0, t1, t2, x2, d2, i
        for (t2 = x, i = 0; i < 8; i++) {
            x2 = this.sampleCurveX(t2) - x
            if (Math.abs(x2) < epsilon) {
                return t2
            }
            d2 = this.sampleCurveDerivativeX(t2)
            if (Math.abs(d2) < 0.000001) {
                break
            }
            t2 = t2 - (x2 / d2)
        }

        t0 = 0.0
        t1 = 1.0
        t2 = x

        while (t0 < t1) {
            x2 = this.sampleCurveX(t2)
            if (Math.abs(x2 - x) < epsilon) {
                return t2
            }
            if (x > x2) {
                t0 = t2
            } else {
                t1 = t2
            }
            t2 = (t1 - t0) * 0.5 + t0
        }

        // Failure
        return t2
    }

    // Evaluates y at the given x. The epsilon parameter provides a hint as to the required
    // accuracy and is not guaranteed.
    solve(x, epsilon = 0.0001) {
        if (x < 0) {
            return this.m_startGradient * x
        }
        if (x > 1) {
            return 1.0 + this.m_endGradient * (x - 1.0)
        }
        return this.sampleCurveY(this.solveCurveX(x, epsilon))
    }
}