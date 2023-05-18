export class Block {
    constructor({ x, y, bg, width, height, bug }) {
        this.getX = () => this.x;
        this.getY = () => this.y;
        this.getWidth = () => this.width;
        this.getHeight = () => this.height;
        this.setBug = (bug) => this.bug = bug;
        this.getBug = () => { var _a; return (_a = this.bug) !== null && _a !== void 0 ? _a : null; };
        this.removeBug = () => this.setBug(null);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.bg = bg;
        this.bug = bug !== null && bug !== void 0 ? bug : null;
    }
    draw(ctx) {
        ctx.fillStyle = this.bg;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
