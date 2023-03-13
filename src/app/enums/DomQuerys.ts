class _BoxQuerys{
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
    EQUIPEMENT_BULLETS:string = `${this.EQUIPEMENT} div.bullets`
    EQUIPEMENT_DAMAGE:string = `${this.EQUIPEMENT} div.extra-damage`
}

class _InfosQuerys{
    PREFIX:string = `${_BoxQuerys.PREFIX} div.info`
    INFO:string = this.PREFIX
    TITLE:string = `${this.PREFIX} div.title`
    LEVEL:string = `${this.PREFIX} div.level`
    POINTS:string = `${this.PREFIX} div.points`
}

class _ArenaQuerys{
    PREFIX:string = `${_BoxQuerys.PREFIX} div.arena`
    ARENA:string = this.PREFIX
}

class _ShootQuerys{
    PREFIX:string = `${_BoxQuerys.PREFIX} div.shot--area`
    SHOOT_AREA:string = this.PREFIX
    SHOOT_POSITION:string = `${this.PREFIX} div.shot--position`
    MOVEMENT_BAR:string = `${this.SHOOT_POSITION} div.movement-bar`
    SHOP_BTN:string = `${this.PREFIX} div.shop-btn`
    PLAY_STOP_MUSIC:string = `${this.PREFIX} div.play-stop-music`
    BTN_RESET_GAME:string = `${this.PREFIX} div.btn-reset-game`
}

class _TerminalQuerys{
    PREFIX:string = `${_BoxQuerys.PREFIX} div.terminal`
    TERMINAL:string = `${this.PREFIX} div.title`
    LOGS:string = `${this.TERMINAL} ul li`
}

export interface ExecuteParams{
    query:string,
    list?:boolean
}

export class DomQuerys{
    static INFOS:_InfosQuerys = new _InfosQuerys()
    static SHOP:_ShopDomQuerys = new _ShopDomQuerys()
    static TERMINAL:_TerminalQuerys = new _TerminalQuerys()
    static ARENA:_ArenaQuerys = new _ArenaQuerys()
    static SHOOT:_ShootQuerys = new _ShootQuerys()

    private static get(query:string):HTMLElement|null {
        return document.querySelector(query)
    }

    private static list(query:string):Array<HTMLElement> {
        return Array.from(document.querySelectorAll(query))
    }

    public static execute(params:ExecuteParams):Array<HTMLElement>|HTMLElement|null {
        return params.list ? this.list(params.query) : this.get(params.query)
    }
}
