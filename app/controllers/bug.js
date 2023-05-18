var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
import { BugModels } from './bug_models.js';
import { Sprite } from './sprite.js';
import { LoadData } from './load_data.js';
class Bug {
    constructor(model) {
        this.model = null;
        this.getLife = () => this.life;
        this.setLife = (life) => this.life = life;
        this.setModel = (model) => this.model = model;
        this.getModel = () => this.model;
        this.getSprite = () => {
            const filter = (this.effectActive) ? Sprite.types.EFFECT : Sprite.types.NORMAL;
            const sprites = this.model.listSprites().filter(e => e.getType() == filter);
            return sprites[this.spriteIndex];
        };
        this.isEffectActive = () => this.effectActive;
        this.getEffect = () => {
            const effect = this.model.getEffect();
            if (effect == null)
                return null;
            return effect.getName();
        };
        this.effectActiveToogle = () => this.effectActive = !this.effectActive;
        this.incrementSpriteIndex = () => {
            const filter = (this.effectActive) ? Sprite.types.EFFECT : Sprite.types.NORMAL;
            const sprites = this.model.listSprites().filter(e => e.getType() == filter);
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
        this.life = null;
        this.width = 50;
        this.height = 50;
        this.img = null;
        this.model = model;
        this.spriteIndex = 0;
        this.spriteEslapsed = 0;
        this.spriteHold = 10;
        this.effectActive = false;
    }
    redraw({ ctx, block }) {
        const sprite = this.getSprite();
        ctx.beginPath();
        ctx.fillStyle = '#ffffff2b';
        ctx.fillRect(block.getX() + 5, block.getY() + 5, block.getWidth() - 10, block.getHeight() - 10);
        ctx.drawImage(this.img, sprite.getCropX(), sprite.getCropY(), sprite.getWidth(), sprite.getHeight(), block.x + 5, block.y + 5, this.width, this.height);
        ctx.closePath();
        this.incrementSpriteIndex();
        if (this.life != null)
            this.life.draw({ ctx: ctx, block: block });
    }
    draw({ ctx, block, level }) {
        if (this.model == null)
            this.raffleModel(level);
        const sprite = this.getSprite();
        this.img = new Image();
        this.img.onload = () => this.redraw({ ctx, block });
        this.img.src = sprite.getImg();
        block.setBug(this);
    }
    raffleModel(level) {
        let rand = Math.floor(Math.random() * 100);
        const fitModels = Bug.models.filter(e => (e.getEmergenceLevel() <= level && e.getEmergenceLevel() != null)
            && (rand >= e.getRangeRaffle().getMin() && rand <= e.getRangeRaffle().getMax()));
        rand = Math.floor(Math.random() * fitModels.length);
        const model = fitModels[rand];
        this.setModel(model);
    }
}
_a = Bug;
Bug.models = [];
Bug.createModels = () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield LoadData.get('./data/bug_models.json');
    data.forEach((e) => Bug.models.push(BugModels.fromJson(e)));
});
export { Bug };
