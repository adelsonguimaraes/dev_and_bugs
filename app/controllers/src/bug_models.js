var _a;
import { Sprite } from "./sprite";
import { BugEffects } from "./bug_effects";
class BugModels {
    constructor({ id, name, sprites = [], description, allowedCollisions, effect, emergenceLevel, rangeRaffle }) {
        this.getEffect = () => BugModels.effects[this.effect.toUpperCase()];
        this.getEmergenceLevel = () => this.emergenceLevel;
        this.getRangeRaffle = () => this.rangeRaffle;
        this.setAlertDrop = (alert) => this.alertDrop = alert;
        this.listSprites = () => this.sprites;
        this.id = id;
        this.name = name;
        this.sprites = sprites;
        this.description = description;
        this.allowedCollisions = allowedCollisions;
        this.effect = effect;
        this.emergenceLevel = emergenceLevel;
        this.rangeRaffle = rangeRaffle;
        this.alertDrop = false;
    }
    static createEffects() {
        return {
            PHANTOM: new BugEffects({
                name: BugEffects.names.PHANTOM,
                event: BugEffects.events.LELVEL_UP,
                action: BugEffects.actions.phantom
            }),
            DIVIDE: new BugEffects({
                name: BugEffects.names.DIVIDE,
                event: BugEffects.events.DEAD,
                action: BugEffects.actions.divide
            }),
        };
    }
}
_a = BugModels;
BugModels.effects = _a.createEffects();
BugModels.fromJson = (data) => {
    const obj = new BugModels(data);
    // obj.id = data.id
    // obj.name = data.name
    // obj.description = data.description
    // obj.allowedCollisions = AllowedCollisions.fromJson(data.allowedCollisions)
    // obj.effect = (data.effect == null) ? null : BugModels.effects[data.effect.toUpperCase()]
    // obj.emergenceLevel = data.emergenceLevel
    // obj.rangeRaffle = RangeRaffle.fromJson(data.rangeRaffle)
    // obj.alertDrop = data.alertDrop
    data.sprites.forEach(e => {
        const sprite = Sprite.fromJson(e);
        obj.sprites.push(sprite);
    });
    return obj;
};
export { BugModels };
