var _a;
class Sprite {
    constructor({ id, img, width, height, cropX, cropY, type = Sprite.types.NORMAL }) {
        this.getImg = () => this.img;
        this.getCropX = () => this.cropX;
        this.getCropY = () => this.cropY;
        this.getWidth = () => this.width;
        this.getHeight = () => this.height;
        this.getType = () => this.type;
        this.id = id;
        this.img = img;
        this.width = width;
        this.height = height;
        this.cropX = cropX;
        this.cropY = cropY;
        this.type = type;
    }
    static fromJson(data) {
        const obj = new Sprite(data);
        return obj;
    }
    static setTypes() {
        return {
            NORMAL: 0,
            EFFECT: 1,
        };
    }
}
_a = Sprite;
Sprite.types = _a.setTypes();
export { Sprite };
