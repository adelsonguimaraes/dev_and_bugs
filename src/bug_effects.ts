import { Block } from './block.js';
import { BugModels } from './bug_models.js';

interface BugEffectsActionInterface {
    ctx?: CanvasRenderingContext2D,
    callback?: Function,
    block?: Block,
    model?: BugModels
}

export interface BugEffectsInterface {
    name:string, 
    event:string, 
    action:Function
}

export class BugEffects {
    private name:string
    private event:string
    private action:Function
    static names = this.setNames()
    static events = this.setEvents()
    static actions = this.setActions()
            
    constructor({name, event, action} : BugEffectsInterface) {
        this.name = name
        this.event = event
        this.action = action
    }

    fromJson = (data:BugEffectsInterface) : BugEffects => {
        this.name = data.name
        this.event = data.event
        this.action = data.action
        return this
    }

    getName = () => this.name
    
    getEvent = () => this.event

    getAction = () => this.action

    private static setActions() {
        return {
            phantom({block}:BugEffectsActionInterface) {
                const bug = block!.getBug()
                bug!.effectActiveToogle()
            },
            divide({callback, model}:BugEffectsActionInterface) {
                callback!({sequence: 2, model})
            }
        }
    }

    private static setNames() {
        return {
            PHANTOM: 'phantom',
            DIVIDE: 'divide',
        }
    }

    private static setEvents() {
        return {
            LELVEL_UP: 'level_up',
            DEAD: 'dead',
            COLLISION: 'collision'
        }
    }
}