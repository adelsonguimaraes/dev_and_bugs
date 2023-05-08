interface SpriteInterface {
    id:number
    img:string
    width:number
    height:number
    cropX:number
    cropY:number
    type?:string
}

export class Sprite {
    private id:number
    private img:string
    private width:number
    private height:number
    private cropX:number
    private cropY:number
    private type:number
    
    static types = this.setTypes()

    constructor({id, img, width, height, cropX, cropY, type=Sprite.types.NORMAL}) {
        this.id = id
        this.img = img
        this.width = width
        this.height = height
        this.cropX = cropX
        this.cropY = cropY
        this.type = type
    }

    fromJson(data:SpriteInterface):Sprite {
        this.id = data.id
        this.img = data.img
        this.width = data.width
        this.height = data.height
        this.cropX = data.cropX
        this.cropY = data.cropY
        this.type = (data.type!=null) ? eval(data.type) : Sprite.types.NORMAL
        return this
    }

    getImg = () => this.img
    getCropX = () => this.cropX
    getCropY = () => this.cropY
    getWidth = () => this.width
    getHeight = () => this.height
    getType = () => this.type

    private static setTypes() {
        return {
            NORMAL: 0,
            EFFECT: 1,
        }
    }
}