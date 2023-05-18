import { Alert } from './alert';
import { Block } from './block';
export class Canvas {
    constructor(size) {
        this.initialColor = "#1f1f1f";
        this.resetColor = () => this.setColor(this.initialColor);
        this.setColor = (color) => {
            this.canvas.style.backgroundColor = color;
        };
        this.getWidth = () => this.width;
        this.getHeigth = () => this.height;
        this.activeInsaneMode = () => {
            if (!Alert.isAlerted(Alert.INSANE_MODE)) {
                this.canvas.style.filter = 'invert(85%)';
                Alert.displayEventInfo(Alert.INSANE_MODE);
            }
        };
        this.desactiveInsaneMode = () => {
            if (Alert.isAlerted(Alert.INSANE_MODE)) {
                this.canvas.style.filter = 'invert(0)';
                Alert.desactiveAlerted(Alert.INSANE_MODE);
            }
        };
        this.canvas = null;
        this.ctx = null;
        this.rows = 8;
        this.columns = 6;
        this.gridBlockSize = size;
        this.width = 360;
        this.height = 560;
        this.gridBg1 = '#40404081';
        this.gridBg2 = '#34343481';
    }
    getCenter() {
        return { x: this.width / 2, y: this.height / 2 };
    }
    getCanvas() {
        this.canvas = document.querySelector('canvas#arena');
        this.ctx = this.canvas.getContext('2d');
    }
    setCanvasConfig() {
        // this.ctx.fillStyle = '#1f1f1f'
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    createGrid({ width = 0, height = 0, blocks }) {
        blocks = [];
        let x = 0;
        let y = 0;
        let current_line = 0;
        let bg = this.gridBg1;
        for (let i = 0; i < (this.rows * this.columns); i++) {
            const diff = parseInt(`${i / this.columns}`);
            if (current_line < diff) {
                current_line = diff;
                y += this.gridBlockSize;
                bg = (bg == this.gridBg1) ? this.gridBg2 : this.gridBg1;
                x = 0;
            }
            const block = new Block({ x: x, y: y, bg: bg, width: width, height: height });
            block.draw(this.ctx);
            bg = (bg == this.gridBg1) ? this.gridBg2 : this.gridBg1;
            x += this.gridBlockSize;
            blocks.push(block);
        }
    }
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
    clearDeadZone() {
        this.ctx.clearRect(0, this.height - 80, this.width, 80);
    }
}
