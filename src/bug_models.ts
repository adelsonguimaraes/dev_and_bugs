import { Sprite, SpriteInterface } from "./sprite.js"
import { AllowedCollisions, AllowedCollisionsInterface } from './allow_colisions.js';
import { RangeRaffle, RangeRaffleInterface } from './range_raffle.js';
import { BugEffects } from "./bug_effects.js";

interface BugModelsEffectsInterface {
    PHANTOM: BugEffects,
    DIVIDE: BugEffects
}

export interface BugModelsInterface {
    id?:number
    name?:string
    sprites?:Array<Sprite>
    description?:string
    allowedCollisions?:AllowedCollisions
    effect?:string
    emergenceLevel?:number
    rangeRaffle?:RangeRaffle
    alertDrop?:boolean
    effects?:BugModelsEffectsInterface
}

export class BugModels {
    private id?:number
    private name?:string
    private sprites?:Array<Sprite>
    private description?:string
    private allowedCollisions?:AllowedCollisions
    private effect?:string|null
    private emergenceLevel?:number
    private rangeRaffle?:RangeRaffle
    private alertDrop?:boolean
    static effects?:BugModelsEffectsInterface = this.createEffects()

    constructor({
        id, name, sprites = [], description, allowedCollisions, 
        effect, emergenceLevel, rangeRaffle
    }:BugModelsInterface) {
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

    static fromJson = (data:BugModelsInterface) => {

        const obj = new BugModels({})
        obj.id = data.id
        obj.name = data.name
        obj.description = data.description
        obj.allowedCollisions = AllowedCollisions.fromJson(data.allowedCollisions as AllowedCollisionsInterface)
        obj.emergenceLevel = data.emergenceLevel
        obj.alertDrop = data.alertDrop
        
        if (data.effect != null) obj.effect =  data.effect.toUpperCase()//BugModels.effects![data.effect.toUpperCase() as keyof typeof BugModels.effects]
        
        if (data.rangeRaffle) obj.rangeRaffle = RangeRaffle.fromJson(data.rangeRaffle as RangeRaffleInterface)

        if (data.sprites) {
            data.sprites.forEach(e => {
                const sprite = Sprite.fromJson(e as SpriteInterface)
                obj.sprites!.push(sprite)
            })
        }
        return obj
    }

    getEffect = () : BugEffects|null => {
        return (this.effect == null) ? null : BugModels.effects![this.effect.toUpperCase() as keyof typeof BugModels.effects]
    }
    getEmergenceLevel = () : number => this.emergenceLevel!
    getRangeRaffle = () : RangeRaffle => this.rangeRaffle!
    setAlertDrop = (alert: boolean) : boolean => this.alertDrop = alert
    listSprites = () : Array<Sprite> => this.sprites!

    private static createEffects () : BugModelsEffectsInterface {
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