// import theme from '../../theme'
import { uuidV4 } from 'uuid'

/**
 * a class generate react instance
 */
class Rect {
    constructor(parent, options) {
        this.id = uuidV4();
        this.parent = parent;
        this.x = options.x;
        this.y = options.y;
        this.w = options.w;
        this.h = options.h;
        this.rectMinSize = [20, 20];
        this.controlPoint = null;

        this.boundry = [];
        this.innerBoundery = [1200, 0, 1200, 0];

        this.type = options.type;
        this.targeted = false;
        this.color0 = null;
        this.highlight = "orange";
        switch (this.type) {
            case "primary":
                this.color0 = "#00DE29";
                this.fillColor = "rgba(0,222,41,0.1)";
                break;
            case "answer":
                this.color0 = "#3888FF";
                this.fillColor = "rgba(56,236,255,0.1)";
                break;
            case "topic":
                this.color0 = "#FF6060";
                this.fillColor = "rgba(255,96,96,0.1)";
                break;
            default:
                console.warn("")
        }
        this.color = this.color0;

        this.judgeSize = 15;
        this.No = null;
        this.text = null;
        this.score = null;
        this.actionSig = null;
    }

    freshRect(e) {
        this.x = e.x;
        this.y = e.y;
        this.w = e.w;
        this.h = e.h;
    }

    lightUp() {
        this.color = this.color0;
    }

    crushOut() {
        // this.color = theme.colors.grays[6];
        this.targeted = false;
    }

    isController(x, y) {
        if (
            x - this.x + y - this.y < this.judgeSize &&
            x > this.x &&
            y > this.y
        )
            return 1;
        if (
            this.x + this.w - x + this.y + this.h - y < this.judgeSize &&
            x < this.x + this.w &&
            y < this.y + this.h
        )
            return 2;
        if (
            x > this.x &&
            x < this.x + this.w &&
            y > this.y &&
            y < this.y + this.h
        )
            return 3;
        return 0;
    }

    setBoundry(e, i) {
        this.boundry = e;
        switch (i) {
            case 1: // LT
                this.setSize([
                    e[0] > this.x ? this.w - (e[0] - this.x) : this.w,
                    e[2] > this.y ? this.h - (e[2] - this.y) : this.h
                ]);
                this.setLocation([
                    e[0] > this.x ? e[0] : this.x,
                    e[2] > this.y ? e[2] : this.y
                ]);

                break;
            case 2: // RB
                this.setSize([
                    this.x + this.w > e[1] ? e[1] - this.x : this.w,
                    this.y + this.h > e[3] ? e[3] - this.y : this.h
                ]);
                break;
            case 3: // MT
                break;
            default:
                console.warn("")
        }
    }

    setInnerBoundry(e) {
        this.innerBoundery = e;
    }

    moveTo(x, y) {
        let dx = x - this.controlPoint[0];
        let dy = y - this.controlPoint[1];

        this.moveToX(dx);
        this.moveToY(dy);

        this.parent.onRectAdjust(this);
    }

    moveToX(dx) {
        if (dx > 0) {
            if (
                this.x + dx > this.innerBoundery[0] ||
                this.x + this.w + dx > this.boundry[1]
            ) {
                if (
                    this.x + dx > this.innerBoundery[0] &&
                    this.x + this.w + dx < this.boundry[1]
                ) {
                    if (this.x < this.innerBoundery[0]) {
                        this.controlPoint[0] += this.innerBoundery[0] - this.x;
                        this.x = this.innerBoundery[0];
                    }
                    return;
                }
                if (
                    this.x + this.w + dx > this.boundry[1] &&
                    this.x + dx < this.innerBoundery[0]
                ) {
                    if (this.x + this.w < this.boundry[1]) {
                        this.controlPoint[0] +=
                            this.boundry[1] - this.x - this.w;
                        this.x = this.boundry[1] - this.w;
                    }
                    return;
                }
                return;
            }
            this.x += dx;
            this.controlPoint[0] += dx;
        } else {
            if (
                this.x + dx < this.boundry[0] ||
                this.x + this.w + dx < this.innerBoundery[1]
            ) {
                if (
                    this.x + dx < this.boundry[0] &&
                    this.x + this.w + dx > this.innerBoundery[1]
                ) {
                    if (this.x > this.boundry[0]) {
                        this.controlPoint[0] -= this.x - this.boundry[0];
                        this.x = this.boundry[0];
                    }
                }
                if (
                    this.x + this.w + dx < this.innerBoundery[1] &&
                    this.x + dx > this.boundry[0]
                ) {
                    if (this.x + this.w > this.innerBoundery[1]) {
                        this.controlPoint[0] -=
                            this.x + this.w - this.innerBoundery[1];
                        this.x = this.innerBoundery[1] - this.w;
                    }
                }
                return;
            }
            this.x += dx;
            this.controlPoint[0] += dx;
        }
    }

    moveToY(dy) {
        if (dy > 0) {
            if (
                this.y + dy > this.innerBoundery[2] ||
                this.y + this.h + dy > this.boundry[3]
            ) {
                if (
                    this.y + dy > this.innerBoundery[2] &&
                    this.y + this.h + dy < this.boundry[3]
                ) {
                    if (this.y < this.innerBoundery[2]) {
                        this.controlPoint[1] += this.innerBoundery[2] - this.y;
                        this.y = this.innerBoundery[2];
                    }
                    return;
                }
                if (
                    this.y + this.h + dy > this.boundry[3] &&
                    this.y + dy < this.innerBoundery[2]
                ) {
                    if (this.y + this.h < this.boundry[3]) {
                        this.controlPoint[1] +=
                            this.boundry[3] - this.y - this.h;
                        this.y = this.boundry[3] - this.h;
                    }
                    return;
                }
                return;
            }
            this.y += dy;
            this.controlPoint[1] += dy;
        } else {
            if (
                this.y + dy < this.boundry[2] ||
                this.y + this.h + dy < this.innerBoundery[3]
            ) {
                if (
                    this.y + dy < this.boundry[2] &&
                    this.y + this.h + dy > this.innerBoundery[3]
                ) {
                    if (this.y > this.boundry[2]) {
                        this.controlPoint[1] -= this.y - this.boundry[2];
                        this.y = this.boundry[2];
                    }
                }
                if (
                    this.y + this.h + dy < this.innerBoundery[3] &&
                    this.y + dy > this.boundry[2]
                ) {
                    if (this.y + this.h > this.innerBoundery[3]) {
                        this.controlPoint[1] -=
                            this.y + this.h - this.innerBoundery[3];
                        this.y = this.innerBoundery[3] - this.h;
                    }
                }
                return;
            }
            this.y += dy;
            this.controlPoint[1] += dy;
        }
    }

    getSize(e) {
        if (e) {
            return [this.x, this.x + this.w, this.y, this.y + this.h];
        } else {
            return [this.x, this.y, this.w, this.h];
        }
    }

    setSize(size) {
        this.w = size[0];
        this.h = size[1];
    }

    setLocation(l) {
        this.x = l[0];
        this.y = l[1];
    }

    reSize(p, i) {

        let dx = p[0] - this.controlPoint[0];
        let dy = p[1] - this.controlPoint[1];
        let tx, ty;

        switch (i) {
            case 1: // Left top
                tx = Math.min(
                    this.innerBoundery[0],
                    this.x + this.w - this.rectMinSize[0]
                );
                ty = Math.min(
                    this.innerBoundery[2],
                    this.y + this.h - this.rectMinSize[1]
                );
                if (this.x + dx < this.boundry[0]) {
                    // left out

                    if (this.x > this.boundry[0]) {
                        this.controlPoint[0] -= this.x - this.boundry[0];
                        this.w += this.x - this.boundry[0];
                        this.x = this.boundry[0];
                    }
                } else if (this.x + dx > tx) {
                    // Right
                    if (this.x < tx) {
                        this.controlPoint[0] += tx - this.x;
                        this.w -= tx - this.x;
                        this.x = tx;
                    }
                } else {

                    this.x += dx;
                    this.w -= dx;
                    this.controlPoint[0] += dx;
                }

                if (this.y + dy < this.boundry[2]) {
                    if (this.y > this.boundry[2]) {
                        this.controlPoint[1] -= this.y - this.boundry[2];
                        this.h += this.y - this.boundry[2];
                        this.y = this.boundry[2];
                    }
                } else if (this.y + dy > ty) {
                    if (this.y < ty) {
                        this.controlPoint[1] += ty - this.y;
                        this.h -= ty - this.y;
                        this.y = ty;
                    }
                } else {
                    this.y += dy;
                    this.h -= dy;
                    this.controlPoint[1] += dy;
                }
                break;

            case 2: // Right but
                tx = Math.max(
                    this.innerBoundery[1],
                    this.x + this.rectMinSize[0]
                );
                ty = Math.max(
                    this.innerBoundery[3],
                    this.y + this.rectMinSize[1]
                );
                if (this.x + this.w + dx > this.boundry[1]) {
                    if (this.x + this.w < this.boundry[1]) {
                        this.controlPoint[0] +=
                            this.boundry[1] - this.w - this.x;
                        this.w = this.boundry[1] - this.x;
                    }
                } else if (this.x + this.w + dx < tx) {
                    if (this.x + this.w > tx) {
                        this.controlPoint[0] -= this.x + this.w - tx;
                        this.w -= this.x + this.w - tx;
                    }
                } else {
                    this.w += dx;
                    this.controlPoint[0] += dx;
                }

                if (this.y + this.h + dy > this.boundry[3]) {
                    if (this.y + this.h < this.boundry[3]) {
                        this.controlPoint[1] +=
                            this.boundry[3] - this.h - this.y;
                        this.h = this.boundry[3] - this.y;
                    }
                } else if (this.y + this.h + dy < ty) {
                    if (this.y + this.h > ty) {
                        this.controlPoint[1] -= this.y + this.h - ty;
                        this.h -= this.y + this.h - ty;
                    }
                } else {
                    this.h += dy;
                    this.controlPoint[1] += dy;
                }
                break;
            default:
                console.warn("")
        }
        this.parent.onRectAdjust(this);
    }

    getArea() {
        return this.w * this.h;
    }

    setControlPoint(l) {
        this.controlPoint = l;
    }

    selfDestory() {}

    setActionStatus(i) {
        this.actionStatus = i;
    }

    setActionSig(i) {
        this.actionSig = i;
    }
}

export default Rect