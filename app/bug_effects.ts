interface BugEffectsInterface {
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
            
    constructor(name:string, event:string, action:Function) {
        this.name = name
        this.event = event
        this.action = action
    }

    fromJson = (data:BugEffectsInterface):BugEffects => {
        this.name = data.name
        this.event = data.event
        this.action = data.action
        return this
    }

    getName = () => this.name
    
    getEvent = () => this.event

    getAction = () => this.action

    private static setActions():object {
        return {
            phantom(block:Block) {
                const bug = block.getBug()
                bug.effectActiveToogle()
            },
            divide(callback:Function, model:BugModels) {
                callback({sequence: 2, model})
            }
        }
    }

    private static setNames():object {
        return {
            PHANTOM: 'phantom',
            DIVIDE: 'divide',
        }
    }

    private static setEvents():object {
        return {
            LELVEL_UP: 'level_up',
            DIVIDE: 'divide',
            COLLISION: 'collision'
        }
    }
}