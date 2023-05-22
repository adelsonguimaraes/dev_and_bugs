import { Sprite } from "./sprite.js";
export class Boss {
    constructor({ id, name, life, sprites }) {
        this.spriteIndex = 0;
        this.spriteEslapsed = 0;
        this.spriteHold = 10;
        this.getLife = () => this.life;
        this.setLife = (life) => this.life = life;
        this.incrementSpriteIndex = () => {
            const filter = Sprite.types.NORMAL;
            const sprites = this.sprites.filter(e => e.getType() == filter);
            if (this.spriteEslapsed >= this.spriteHold) {
                this.spriteEslapsed = 0;
                if (this.spriteIndex >= (sprites.length - 1)) {
                    this.spriteIndex = 0;
                }
                else {
                    this.spriteIndex++;
                }
            }
            else {
                this.spriteEslapsed++;
            }
        };
        this.getSprite = () => {
            const filter = Sprite.types.NORMAL;
            const sprites = this.sprites.filter(e => e.getType() == filter);
            return sprites[this.spriteIndex];
        };
        this.draw = ({ ctx, block, life }) => {
            const sprite = this.getSprite();
            this.img = new Image();
            this.img.onload = () => this.redraw({ ctx, block });
            this.img.src = sprite.getImg();
            this.setLife(life);
            // block.setBug(this)
        };
        this.id = id;
        this.name = name;
        this.life = life;
        this.sprites = sprites;
    }
    static fromJson(data) {
        const obj = new Boss(data);
        obj.sprites = [];
        data.sprites.forEach(e => {
            const sprite = Sprite.fromJson(e);
            obj.sprites.push(sprite);
        });
        return obj;
    }
    setComputedLife({ baseBugLife, incrementBugLife }) {
        this.life = (baseBugLife + (baseBugLife * (incrementBugLife / 100)));
        this.life *= 10;
    }
    redraw({ ctx, block }) {
        const sprite = this.getSprite();
        const width = (block.getWidth() * 2) - 10;
        const height = (block.getHeight() * 2) - 10;
        ctx.beginPath();
        ctx.fillStyle = '#ffffff2b';
        ctx.fillRect(block.getX() + 5, block.getY() + 5, width, height);
        ctx.drawImage(this.img, sprite.getCropX(), sprite.getCropY(), sprite.getWidth(), sprite.getHeight(), block.x + 5, block.y + 5, width, height);
        ctx.closePath();
        this.incrementSpriteIndex();
        // if (this.life != null) this.life.draw({ctx: ctx, block: block});
    }
}
