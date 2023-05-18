export class BulletModes {
    constructor({ id, name, aceleration, colisions, color, damage, point }) {
        this.getId = () => this.id;
        this.getName = () => this.name;
        this.getDamage = () => this.damage;
        this.getPoint = () => this.point;
        this.id = id;
        this.name = name;
        this.aceleration = aceleration;
        this.colisions = colisions;
        this.color = color;
        this.damage = damage;
        this.point = point;
    }
    getAceleration() {
        return this.aceleration;
    }
    getColisions() {
        return this.colisions;
    }
    getColor() {
        return this.color;
    }
}
