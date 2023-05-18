var _a;
class Shop {
    static reset() {
        this.bullet = this.ininital_value;
        this.extra_damage = this.ininital_value;
    }
}
_a = Shop;
Shop.ininital_value = 2;
Shop.divBulletValue = document.querySelector('div.menu .item-bullet .value');
Shop.divDamageValue = document.querySelector('div.menu .item-damage .value');
Shop.getBullet = () => _a.bullet;
Shop.getExtraDamage = () => _a.extra_damage;
Shop.setBulletPrice = (totalBullets) => {
    _a.bullet *= (totalBullets);
};
Shop.setExtraDamagePrice = (totalExtraDamage) => {
    _a.extra_damage *= (totalExtraDamage);
};
Shop.displayValues = () => {
    _a.divBulletValue.innerHTML = `${_a.bullet}`;
    _a.divDamageValue.innerHTML = `${_a.extra_damage}`;
};
export { Shop };
