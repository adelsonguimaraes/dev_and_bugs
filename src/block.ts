import { Bug } from './bug.js';

interface BlockInterface {
    x: number;
    y: number;
    bg: string;
    width: number;
    height: number;
    bug?: Bug|null;
}

export class Block {
    x: number;
    y: number;
    bg: string;
    width: number;
    height: number;
    bug?: Bug|null;

    constructor({x, y, bg, width, height, bug}: BlockInterface) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.bg = bg
        this.bug = bug ?? null
    }

    getX = () : number => this.x
    getY = () : number => this.y
    getWidth = () : number => this.width
    getHeight = () : number => this.height

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.bg
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    setBug = (bug: Bug|null) => this.bug = bug

    getBug = () : Bug|null => this.bug ?? null

    removeBug = () => this.setBug(null)
    
}