import { Critical } from './critical.js';
export class BugLife {
    constructor() {
        this.life = 1000;
        this.width = 50;
        this.height = 5;
        this.color = 'red';
    }
    setComputedLife({ baseBugLife, incrementBugLife, level, isBoss = false }) {
        this.life = (level <= 1)
            ? baseBugLife
            : (baseBugLife + (baseBugLife * (incrementBugLife / 100)));
        if (isBoss)
            this.life *= 10;
    }
    setWidth(width) {
        this.width = width;
    }
    getWidth() {
        return this.width;
    }
    setColor(color) {
        this.color = color;
    }
    getColor() {
        return this.color;
    }
    draw({ ctx, block, isBoss = false }) {
        ctx.beginPath();
        ctx.fillStyle = '#3e0d0d';
        ctx.fillRect(block.x + 5, (block.y + block.height), 50, this.height);
        ctx.fillStyle = this.color;
        let width = this.width;
        if (isBoss)
            width = (this.width * 2 + 10);
        ctx.fillRect(block.x + 5, (block.y + block.height), width, this.height);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
    }
    calcLife({ damage, extraDamage, baseBugLife, bulletMode }) {
        const damageMode = bulletMode.getDamage();
        const critical = Critical.tryCritical(extraDamage);
        const damageComputed = (((damage + extraDamage) * damageMode) / 100 * baseBugLife) + critical;
        const current_life = (this.width * 2) / 100 * this.life;
        const new_life = (current_life - damageComputed);
        const new_life_percent = ((new_life * 100 / this.life) / 2);
        this.setWidth(new_life_percent);
        return new_life;
    }
}
