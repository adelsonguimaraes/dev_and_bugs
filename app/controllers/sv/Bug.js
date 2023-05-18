"use strict";
class Bug {
    constructor(bugId, slotId, life, effect, effectActive) {
        this.bugId = bugId;
        this.slotId = slotId;
        this.life = life;
        this.effect = effect;
        this.effectActive = effectActive;
    }
    setData(data) {
        this.bugId = data.bugId;
        this.slotId = data.slotId;
        this.life = data.life;
        this.effect = data.effect;
        this.effectActive = data.effectActive;
        return this;
    }
    setDataList(dataList) {
        const list = [];
        dataList.forEach(data => list.push(Object.assign({}, this.setData(data))));
        return list;
    }
    setLife(life) {
        this.life = life;
    }
    setEffectActive(effectActive) {
        this.effectActive = effectActive;
    }
}
module.exports = Bug;
