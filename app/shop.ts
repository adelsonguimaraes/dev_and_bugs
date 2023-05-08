export class Shop {
    private static bullet:number
    private static extra_damage:number
    private static ininital_value:number = 2
    static divBulletValue:HTMLDivElement|null = document.querySelector('div.menu .item-bullet .value')
    static divDamageValue:HTMLDivElement|null = document.querySelector('div.menu .item-damage .value')

    static reset() {
        this.bullet = this.ininital_value
        this.extra_damage = this.ininital_value
    }

    static getBullet = () => this.bullet
    static getExtraDamage = () => this.extra_damage

    static setBulletPrice = ({totalBullets}) => {
        this.bullet*= (totalBullets)
    }

    static setExtraDamagePrice = ({totalExtraDamage}) => {
        this.extra_damage*= (totalExtraDamage)
    }


    static displayValues = () => {
        this.divBulletValue!.innerHTML = `${this.bullet}`
        this.divDamageValue!.innerHTML = `${this.extra_damage}`
    }
}