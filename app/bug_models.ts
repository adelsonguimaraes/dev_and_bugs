export class BugModels {
    private id:number
    private name:string
    private sprites:Array<Sprite>
    private description:string
    private allowedCollisions:AllowedCollisions
    private effect:string
    private emergenceLevel:number
    private rangeRaffle:RangeRaffle
    private alertDrop:boolean
    static effects = this.createEffects()

    constructor({id, name, sprites = [], description, allowedCollisions, effect, emergenceLevel, rangeRaffle}) {
        this.id = id
        this.name = name
        this.sprites = sprites
        this.description = description
        this.allowedCollisions = allowedCollisions
        this.effect = effect
        this.emergenceLevel = emergenceLevel
        this.rangeRaffle = rangeRaffle
        this.alertDrop = false
    }

    fromJson = (data:BugModels) => {
        this.id = data.id
        this.name = data.name
        this.description = data.description
        this.allowedCollisions = new AllowedCollisions().fromJson({data: data.allowedCollisions})
        this.effect = (data.effect == null) ? null : BugModels.effects[data.effect.toUpperCase()]
        this.emergenceLevel = data.emergenceLevel
        this.rangeRaffle = new RangeRaffle().fromJson(data.rangeRaffle)
        this.alertDrop = data.alertDrop
        data.sprites.forEach(e => {
            const sprite = new Sprite()
            sprite.fromJson(e)
            this.sprites.push(sprite)
        })

        return this
    }

    getEffect = ():string => this.effect
    getEmergenceLevel = ():number => this.emergenceLevel
    getRangeRaffle = ():RangeRaffle => this.rangeRaffle
    setAlertDrop = (alert:boolean):boolean => this.alertDrop = alert
    listSprites = ():Array<Sprite> => this.sprites

    private static createEffects ():object {
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
        }
    }
}