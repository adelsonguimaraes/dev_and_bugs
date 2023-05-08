interface AllowedCollisionsParams{
    left: boolean|null
    right:boolean
    top:boolean
    bottom:boolean
}

export class AllowedCollisions {
    left:boolean|null
    right:boolean
    top:boolean
    bottom:boolean

    constructor(left=null, right=true, top=true, bottom=true) {
        this.left = left
        this.right = right
        this.top = top
        this.bottom = bottom
    }

    fromJson = (data:AllowedCollisionsParams) => {
        if (data==null) return data

        this.left = data.left
        this.right = data.right
        this.top = data.top
        this.bottom = data.bottom
        return this
    }
}