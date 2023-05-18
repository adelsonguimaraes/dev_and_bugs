export class Dungeon {
    constructor({ id, name, level, boss, multiplier, color }) {
        this.getName = () => this.name;
        this.getLevel = () => this.level;
        this.getBoss = () => this.boss;
        this.getColor = () => this.color;
        this.getComputedBossLife = () => this.boss.getLife() * this.multiplier;
        this.toEnter = () => this.inside = true;
        this.toGoOut = () => this.inside = false;
        this.id = id;
        this.name = name;
        this.level = level;
        this.boss = boss;
        this.multiplier = multiplier;
        this.color = color;
        this.inside = false;
    }
}
