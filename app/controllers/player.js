export class Player {
    constructor() {
        this.img = null;
        this.setX = (x) => this.x = x;
        this.getX = () => this.x;
        this.setY = (y) => this.y = y;
        this.getY = () => this.y;
        this.setPoints = (points) => this.points = points;
        this.getPoints = () => this.points;
        this.incrementPoints = (bulletMode) => this.points += bulletMode.getPoint();
        this.getCenter = () => ({ x: this.x, y: this.y });
        this.getRight = () => (this.x + this.size);
        this.getLeft = () => (this.x - this.size);
        this.getTop = () => (this.y + this.size);
        this.resetMoviment = () => this.movement = 50;
        this.redraw = (ctx) => {
            ctx.drawImage(this.img, (this.x - this.size), (this.y - this.size), 50, 50);
            this.drawMovementBar(ctx);
        };
        // setMovement = (movement) => this.movement = movement
        this.getDamage = () => this.damage;
        this.setExtraDamage = (extraDamage) => this.extraDamage = extraDamage;
        this.getExtraDamage = () => this.extraDamage;
        this.movement = 50;
        this.movementColor = '#10a580';
        this.size = 25;
        this.x = null;
        this.y = null;
        // this.img = null
        this.points = 0;
        this.damage = 40;
        this.extraDamage = 0;
        this.moveDirections = { left: 'left', right: 'right' };
    }
    moving(direction) {
        if (this.movement <= 0) {
            return false;
        }
        if (direction == this.moveDirections.right) {
            this.x++;
        }
        else {
            this.x--;
        }
        this.movement--;
    }
    moveToRight(limit) {
        const keys = ['ArrowRight', 'd'];
        document.body.addEventListener('keydown', (e) => {
            if (keys.indexOf(e.key) >= 0) {
                if (this.getRight() >= limit)
                    return false;
                this.moving(this.moveDirections.right);
            }
        });
        document.body.addEventListener('keyup', (e) => {
            if (keys.indexOf(e.key) >= 0) {
                console.log('parou de andar para a direita');
            }
        });
    }
    moveToLeft(limit) {
        const keys = ['ArrowLeft', 'a'];
        document.body.addEventListener('keydown', (e) => {
            if (keys.indexOf(e.key) >= 0) {
                if (this.getLeft() <= limit)
                    return false;
                this.moving(this.moveDirections.left);
            }
        });
        document.body.addEventListener('keyup', (e) => {
            if (keys.indexOf(e.key) <= 0) {
                console.log('parou de andar para a direita');
            }
        });
    }
    drawMovementBar(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#d9d9d9';
        ctx.fillRect(this.getLeft(), this.getTop() + 2, this.size * 2, 5);
        ctx.fillStyle = this.movementColor;
        ctx.fillRect(this.getLeft(), this.getTop() + 2, this.movement, 5);
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }
    draw(canvas) {
        this.setX(canvas.width / 2);
        this.setY(canvas.height - 40);
        this.img = new Image();
        this.img.onload = () => canvas.ctx.drawImage(this.img, (this.x - this.size), (this.y - this.size), 50, 50);
        this.img.src = "./img/nerd-cat.gif";
        canvas.ctx.closePath();
        this.moveToRight(canvas.width);
        this.moveToLeft(0);
    }
}
