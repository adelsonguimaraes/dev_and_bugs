var _a;
class BugEffects {
    constructor({ name, event, action }) {
        this.fromJson = (data) => {
            this.name = data.name;
            this.event = data.event;
            this.action = data.action;
            return this;
        };
        this.getName = () => this.name;
        this.getEvent = () => this.event;
        this.getAction = () => this.action;
        this.name = name;
        this.event = event;
        this.action = action;
    }
    static setActions() {
        return {
            phantom({ block }) {
                const bug = block.getBug();
                bug.effectActiveToogle();
            },
            divide({ callback, model }) {
                callback({ sequence: 2, model });
            }
        };
    }
    static setNames() {
        return {
            PHANTOM: 'phantom',
            DIVIDE: 'divide',
        };
    }
    static setEvents() {
        return {
            LELVEL_UP: 'level_up',
            DEAD: 'dead',
            COLLISION: 'collision'
        };
    }
}
_a = BugEffects;
BugEffects.names = _a.setNames();
BugEffects.events = _a.setEvents();
BugEffects.actions = _a.setActions();
export { BugEffects };
