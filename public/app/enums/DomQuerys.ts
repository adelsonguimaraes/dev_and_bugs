class _ShopDomQuerys{
    PREFIX:string = "div.shop"
    SHOP:string = this.PREFIX
    SHOP_BTN_CLOSE:string = `${this.PREFIX} div.close-shop-btn`
    POINTS_IN_SHOP:string = `${this.PREFIX} div.points`
    SHOP_LIST:string = `${this.PREFIX} ul.shop-list`
    SHOP_ITEM_BULLET:string = `${this.SHOP_LIST} li.shop-item-bulltet`
    SHOP_ITEM_EXTRA_DAMAGE = `${this.SHOP_LIST} li.shop-extra-damage`
    BULLET_VALUE = `${this.SHOP_ITEM_BULLET} div.value`
    DAMAGE_VALUE = `${this.SHOP_ITEM_EXTRA_DAMAGE} div.vaue`
    BTN_BULLET_PAY = `${this.SHOP_ITEM_BULLET} div.action`
    BTN_DAMAGE_PAY = `${this.SHOP_ITEM_EXTRA_DAMAGE} div.action`
    EQUIPEMENT = `${this.PREFIX} div.equipement`
    EQUIP_BULLETS = `${this.EQUIPEMENT} div.bullets`
    EQUIP_DAMAGE = `${this.EQUIPEMENT} div.extra-damage`
}