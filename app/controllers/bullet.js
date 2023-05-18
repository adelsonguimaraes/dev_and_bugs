import { BulletModes } from './bullet_modes.js';
export class Bullet {
    constructor({ x, y }) {
        this.velocityX = 0;
        this.velocityY = 0;
        this.initDelay = 0;
        this.mode = null;
        this.getColisions = () => this.colisions;
        this.setSize = (size) => this.size = size;
        this.setInitDelay = (initDelay) => this.initDelay = initDelay;
        this.getMode = () => this.mode;
        this.setMode = (mode) => this.mode = mode;
        this.getOrientationX = () => this.orX;
        this.toogleOrientationX = () => this.orX *= -1;
        this.getOrientationY = () => this.orY;
        this.toogleOrientationY = () => this.orY *= -1;
        this.x = x;
        this.y = y;
        this.size = 10;
        this.colisions = 0;
        this.directionX = 1;
        this.directionY = 1;
        // this.velocityX = null
        // this.velocityY = null
        // this.initDelay = null
        this.currentDelay = 0;
        // this.mode = null
        this.modes = [];
        this.orX = 1;
        this.orY = 1;
        this.createModes();
        this.setMode(this.modes[0]);
    }
    setCoords({ x, y }) {
        if (this.currentDelay > this.initDelay) {
            this.x = x !== null && x !== void 0 ? x : this.x;
            this.y = y !== null && y !== void 0 ? y : this.y;
        }
        else {
            this.currentDelay++;
        }
    }
    getCoords() {
        return {
            x: this.x,
            y: this.y,
            top: (this.y - this.size / 2),
            left: (this.x - this.size / 2),
            right: (this.x + this.size / 2),
            bottom: (this.y + this.size / 2),
            size: this.size,
            dx: this.directionX,
            dy: this.directionY,
            vx: this.velocityX,
            vy: this.velocityY,
        };
    }
    incrementColisions(canvas) {
        this.colisions++;
        const mode = this.modes.filter((e) => e.getColisions() <= this.colisions).at(-1);
        if (mode.getName() == 'Insane') {
            canvas.activeInsaneMode();
        }
        this.setMode(mode);
    }
    toogleDirectionX() {
        this.directionX *= -1;
        this.toogleOrientationX();
    }
    toogleDirectionY() {
        this.directionY *= -1;
        this.toogleOrientationY();
    }
    setVelocityXY({ vx, vy }) {
        this.velocityX = vx;
        this.velocityY = vy;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.mode.getColor();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    createModes() {
        this.modes = [
            new BulletModes({ id: 1, name: 'Normal', aceleration: 1.5, colisions: 0, color: '#7fff00', damage: 1, point: 1 }),
            new BulletModes({ id: 2, name: 'Moderate', aceleration: 2, colisions: 15, color: '#ffa000', damage: 2, point: 2 }),
            new BulletModes({ id: 3, name: 'High', aceleration: 2.5, colisions: 30, color: '#e22b2b', damage: 2.5, point: 3 }),
            new BulletModes({ id: 4, name: 'Insane', aceleration: 3, colisions: 50, color: 'white', damage: 3, point: 5 })
        ];
    }
}
