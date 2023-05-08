export class Block {
    x: number;
    y: number;
    bg: string;
    width: number;
    height: number;
    bug: number|null;

    constructor({x, y, bg, width, height, bug=null}) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.bg = bg
        this.bug = bug
    }

    getX = () => this.x
    getY = () => this.y
    getWidth = () => this.width
    getHeight = () => this.height

    draw(ctx) {
        ctx.fillStyle = this.bg
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    setBug(bug: number|null) {
        this.bug = bug
    }

    getBug() {
        return this.bug
    }

    removeBug() {
        this.setBug(null)
    }
}