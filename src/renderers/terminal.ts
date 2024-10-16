import keypress from 'keypress';

import { Eloqube } from '../core/eloqube';
import { IKeyPress, IMousePress } from '../types';

import CONFIG from '../config.json';

const { WIDTH, HEIGHT, DRAG_FACTOR, DAMPING } = CONFIG;
const ANG_VEL_FACTOR = DRAG_FACTOR * 0.01;

export class TerminalEloqube {
    private lastMouseX = 0;
    private lastMouseY = 0;

    private mouseX = 0;
    private mouseY = 0;

    private interval?: NodeJS.Timeout;

    constructor(
        private eloqube: Eloqube,
        private options: { fps: number }
    ) {
        this.eloqube.angularVelA = (Math.random() - 0.5) * 2 * ANG_VEL_FACTOR;
        this.eloqube.angularVelB = (Math.random() - 0.5) * 2 * ANG_VEL_FACTOR;

        this.setupInputListeners();
    }

    private setupInputListeners() {
        keypress(process.stdin);
        process.stdin.setRawMode(true);
        process.stdin.resume();

        process.stdin.on('keypress', (_ch: string, key: IKeyPress) => {
            if (key && key.ctrl && key.name === 'c') {
                process.stdout.write('\x1b[?1003l');
                process.exit();
            }
        });

        process.stdin.on('mousepress', (info: IMousePress) => {
            this.handleMouseEvent(info);
        });

        process.stdout.write('\x1b[?1003h');
    }

    private handleMouseEvent(info: IMousePress) {
        let event = '';

        if (info.name === 'mouse' && info.button === 0 && !info.release) event = 'mousedown';
        if (info.name === 'mouse' && info.release && info.scroll === 0) event = 'mouseup';
        if (info.name === 'mouse' && info.scroll === -1 && !info.release) event = 'mousedrag';

        this.mouseX = info.x;
        this.mouseY = info.y;

        switch (event) {
            case "mousedrag":
                const deltaX = info.x - this.lastMouseX;
                const deltaY = info.y - this.lastMouseY;

                this.eloqube.A -= deltaY * (Math.PI / 180) * 8 * DRAG_FACTOR;
                this.eloqube.B += deltaX * (Math.PI / 180) * 4 * DRAG_FACTOR;

                this.eloqube.A = this.eloqube.A % (Math.PI * 2);
                this.eloqube.B = this.eloqube.B % (Math.PI * 2);
                this.eloqube.C = this.eloqube.C % (Math.PI * 2);

                break;

            case "mousedown":
                this.eloqube.angularVelA = 0;
                this.eloqube.angularVelB = 0;
                break;

            case "mouseup":
                const dx = this.mouseX - this.lastMouseX;
                const dy = this.mouseY - this.lastMouseY;

                this.eloqube.angularVelA = dy * ANG_VEL_FACTOR;
                this.eloqube.angularVelB = dx * ANG_VEL_FACTOR;
                break;
        }
    }

    public updateCubeRotation() {
        this.eloqube.A -= this.eloqube.angularVelA * (Math.PI / 180) * 8 * 100;
        this.eloqube.B += this.eloqube.angularVelB * (Math.PI / 180) * 4 * 100;

        this.eloqube.A = this.eloqube.A % (Math.PI * 2);
        this.eloqube.B = this.eloqube.B % (Math.PI * 2);

        this.eloqube.angularVelA *= DAMPING;
        this.eloqube.angularVelB *= DAMPING;

        this.lastMouseX = this.mouseX;
        this.lastMouseY = this.mouseY;
    }

    private render() {
        this.eloqube.render();

        let output = "";

        for (let k = 0; k < WIDTH * HEIGHT; k++) {
            const row = Math.floor(k / WIDTH);
            const col = k % WIDTH;
            output += `\x1b[${row + 1};${col + 1}H${this.eloqube.getColorBuffer()[k]}${this.eloqube.getBuffer()[k]}\x1b[0m`;
        }

        process.stdout.write(output);
    }

    public animate() {
        this.interval = setInterval(() => {
            this.updateCubeRotation();
            this.render();
        }, 1000 / this.options.fps);
    }

    public stop() {
        clearInterval(this.interval);
    }
}