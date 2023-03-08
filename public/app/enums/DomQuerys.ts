class _Box{
    static PREFIX:string = "div.box"
}

class _ShopDomQuerys{
    PREFIX:string = "div.shop"
    SHOP:string = this.PREFIX
    SHOP_BTN_CLOSE:string = `${this.PREFIX} div.close-shop-btn`
    POINTS_IN_SHOP:string = `${this.PREFIX} div.points`
    SHOP_LIST:string = `${this.PREFIX} ul.shop-list`
    SHOP_ITEM_BULLET:string = `${this.SHOP_LIST} li.shop-item-bulltet`
    SHOP_ITEM_EXTRA_DAMAGE:string = `${this.SHOP_LIST} li.shop-extra-damage`
    BULLET_VALUE:string = `${this.SHOP_ITEM_BULLET} div.value`
    DAMAGE_VALUE:string = `${this.SHOP_ITEM_EXTRA_DAMAGE} div.vaue`
    BTN_BULLET_PAY:string = `${this.SHOP_ITEM_BULLET} div.action`
    BTN_DAMAGE_PAY:string = `${this.SHOP_ITEM_EXTRA_DAMAGE} div.action`
    EQUIPEMENT:string = `${this.PREFIX} div.equipement`
    EQUIP_BULLETS:string = `${this.EQUIPEMENT} div.bullets`
    EQUIP_DAMAGE:string = `${this.EQUIPEMENT} div.extra-damage`
}

class _Infos{
    PREFIX:string = `${_Box.PREFIX} div.info`
    INFO:string = this.PREFIX
    TITLE:string = `${this.PREFIX} div.title`
    LEVEL:string = `${this.PREFIX} div.level`
    POINTS:string = `${this.PREFIX} div.points`
}

class _Arena{
    PREFIX:string = `${_Box.PREFIX} div.arena`
    ARENA:string = this.PREFIX
}

class _ShootArea{
    PREFIX:string = `${_Box.PREFIX} div.shot--area`
    SHOOT_POSITION:string = `${this.PREFIX} div.shot--position`
    MOVEMENT_BAR:string = `${this.SHOOT_POSITION} div.movement-bar`
    SHOP_BTN:string = `${this.PREFIX} div.shop-btn`
    PLAY_STOP_MUSIC:string = `${this.PREFIX} div.play-stop-music`
    BTN_RESET_GAME:string = `${this.PREFIX} div.btn-reset-game`
}

class _Terminal{
    PREFIX:string = `${_Box.PREFIX} div.terminal`
    TERMINAL:string = `${this.PREFIX} div.title`
}

class DomQuerys{
    static INFOS:_Infos = new _Infos()
    static SHOP:_ShopDomQuerys = new _ShopDomQuerys()
    
    private get(query:string):HTMLElement {
        return document.querySelector(query)
    }

    private list(query:string):Array<HTMLElement> {
        return Array.from(document.querySelectorAll(query))
    }

    execute(query:string, list:boolean=false) {
        return list ? this.get(query) : this.list(query)
    }
}
