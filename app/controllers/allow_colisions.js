class AllowedCollisions {
    constructor({ left = null, right = true, top = true, bottom = true }) {
        this.getLeft = () => this.left;
        this.getRight = () => this.right;
        this.getTop = () => this.top;
        this.getBottom = () => this.bottom;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
}
AllowedCollisions.fromJson = (data) => {
    const obj = new AllowedCollisions(data);
    // obj.left = data.left
    // obj.right = data.right
    // obj.top = data.top
    // obj.bottom = data.bottom
    return obj;
};
export { AllowedCollisions };