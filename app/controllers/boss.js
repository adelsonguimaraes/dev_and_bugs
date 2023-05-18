import { Sprite } from "./sprite.js";
export class Boss {
    constructor({ id, name, life, sprites }) {
        this.getLife = () => this.life;
        this.setLife = (life) => this.life = life;
        this.id = id;
        this.name = name;
        this.life = life;
        this.sprites = sprites;
    }
    static fromJson(data) {
        const obj = new Boss(data);
        data.sprites.forEach(e => {
            const sprite = Sprite.fromJson(e);
            obj.sprites.push(sprite);
        });
        return obj;
    }
}
