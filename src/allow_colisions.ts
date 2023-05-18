interface AllowedCollisionsParams{
    left: boolean|null
    right:boolean
    top:boolean
    bottom:boolean
}

export interface AllowedCollisionsInterface {
    left:boolean|null
    right:boolean
    top:boolean
    bottom:boolean
}

export class AllowedCollisions {
    left:boolean|null
    right:boolean
    top:boolean
    bottom:boolean

    constructor({left=null, right=true, top=true, bottom=true}:AllowedCollisionsInterface) {
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
    }

    getLeft = () => this.left
    getRight = () => this.right
    getTop = () => this.top
    getBottom = () => this.bottom

    static fromJson = (data: AllowedCollisionsInterface) : AllowedCollisions => {
        const obj = new AllowedCollisions(data)
        
        // obj.left = data.left
        // obj.right = data.right
        // obj.top = data.top
        // obj.bottom = data.bottom
        return obj
    }
}