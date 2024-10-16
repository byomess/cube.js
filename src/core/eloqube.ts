import CONFIG from '../config.json';
import { IEloqubeConfig } from '../types';


const {
    WIDTH,
    HEIGHT,
    CUBE_WIDTH,
    INCREMENT_SPEED,
    DRAG_FACTOR,
    K1,
    DISTANCE_FROM_CAM,
    CHARS,
    COLORS,
    BACKGROUND_CHAR
}: IEloqubeConfig = CONFIG;

const ANG_VEL_FACTOR = DRAG_FACTOR * 0.01;

export class Eloqube {
    public A = 0;
    public B = 0;
    public C = 0;

    public angularVelA = (Math.random() - 0.5) * 2 * ANG_VEL_FACTOR;
    public angularVelB = (Math.random() - 0.5) * 2 * ANG_VEL_FACTOR;

    private zBuffer: number[];
    private buffer: string[];
    private colorBuffer: string[];

    private sinA = 0;
    private cosA = 0;
    private sinB = 0;
    private cosB = 0;
    private sinC = 0;
    private cosC = 0;

    constructor() {
        this.zBuffer = new Array(WIDTH * HEIGHT).fill(0);
        this.buffer = new Array(WIDTH * HEIGHT).fill(BACKGROUND_CHAR);
        this.colorBuffer = new Array(WIDTH * HEIGHT).fill('');
    }

    private precomputeTrigonometry() {
        this.sinA = Math.sin(this.A);
        this.cosA = Math.cos(this.A);
        this.sinB = Math.sin(this.B);
        this.cosB = Math.cos(this.B);
        this.sinC = Math.sin(this.C);
        this.cosC = Math.cos(this.C);
    }

    private getCharacterForIntensity(intensity: number): string {
        const index = Math.floor(intensity * CHARS.length);
        return CHARS[index] || ' ';
    }

    private getColorForFace(face: string, intensity: number): string {
        if (intensity > 0.66) return COLORS[face][0];
        if (intensity > 0.33) return COLORS[face][1];
        return COLORS[face][2];
    }

    private calculateFaceX(i: number, j: number, k: number): number {
        return j * this.sinA * this.sinB * this.cosC - k * this.cosA * this.sinB * this.cosC + j * this.cosA * this.sinC + k * this.sinA * this.sinC + i * this.cosB * this.cosC;
    }

    private calculateFaceY(i: number, j: number, k: number): number {
        return j * this.cosA * this.cosC + k * this.sinA * this.cosC - j * this.sinA * this.sinB * this.sinC + k * this.cosA * this.sinB * this.sinC - i * this.cosB * this.sinC;
    }

    private calculateFaceZ(i: number, j: number, k: number): number {
        return k * this.cosA * this.cosB - j * this.sinA * this.cosB + i * this.sinB;
    }

    private calculateFaceNormal(cubeX: number, cubeY: number, cubeZ: number): [number, number, number, string] {
        if (cubeZ === CUBE_WIDTH) return [0, 0, 1, 'front'];
        if (cubeZ === -CUBE_WIDTH) return [0, 0, -1, 'back'];
        if (cubeX === CUBE_WIDTH) return [1, 0, 0, 'right'];
        if (cubeX === -CUBE_WIDTH) return [-1, 0, 0, 'left'];
        if (cubeY === CUBE_WIDTH) return [0, 1, 0, 'top'];
        if (cubeY === -CUBE_WIDTH) return [0, -1, 0, 'bottom'];
        return [0, 0, 0, ''];
    }

    private rotateNormal(nx: number, ny: number, nz: number): [number, number, number] {
        const rotatedX = this.calculateFaceX(nx, ny, nz);
        const rotatedY = this.calculateFaceY(nx, ny, nz);
        const rotatedZ = this.calculateFaceZ(nx, ny, nz);
        return [rotatedX, rotatedY, rotatedZ];
    }

    private calculateForSurface(cubeX: number, cubeY: number, cubeZ: number) {
        const x = this.calculateFaceX(cubeX, cubeY, cubeZ);
        const y = this.calculateFaceY(cubeX, cubeY, cubeZ);
        const z = this.calculateFaceZ(cubeX, cubeY, cubeZ) + DISTANCE_FROM_CAM;

        const ooz = 1 / z;
        const xp = Math.floor(WIDTH / 2 + K1 * ooz * x * 2);
        const yp = Math.floor(HEIGHT / 2 + K1 * ooz * y);
        const idx = xp + yp * WIDTH;

        if (idx >= 0 && idx < WIDTH * HEIGHT && ooz > this.zBuffer[idx]) {
            this.zBuffer[idx] = ooz;
            let [nx, ny, nz, face] = this.calculateFaceNormal(cubeX, cubeY, cubeZ);
            [nx, ny, nz] = this.rotateNormal(nx, ny, nz);

            const lightDirection = [0, 0, -1];
            const intensity = nx * lightDirection[0] + ny * lightDirection[1] + nz * lightDirection[2];
            const lightIntensity = Math.max(0, intensity);
            const character = this.getCharacterForIntensity(lightIntensity);
            const color = this.getColorForFace(face, lightIntensity);

            this.buffer[idx] = character;
            this.colorBuffer[idx] = color;
        }
    }

    public render() {
        this.buffer.fill(BACKGROUND_CHAR);
        this.colorBuffer.fill('');
        this.zBuffer.fill(0);
        this.precomputeTrigonometry();

        for (let cubeX = -CUBE_WIDTH; cubeX < CUBE_WIDTH; cubeX += INCREMENT_SPEED) {
            for (let cubeY = -CUBE_WIDTH; cubeY < CUBE_WIDTH; cubeY += INCREMENT_SPEED) {
                this.calculateForSurface(cubeX, cubeY, -CUBE_WIDTH);
                this.calculateForSurface(CUBE_WIDTH, cubeY, cubeX);
                this.calculateForSurface(-CUBE_WIDTH, cubeY, -cubeX);
                this.calculateForSurface(-cubeX, cubeY, CUBE_WIDTH);
                this.calculateForSurface(cubeX, -CUBE_WIDTH, -cubeY);
                this.calculateForSurface(cubeX, CUBE_WIDTH, cubeY);
            }
        }
    }

    public getBuffer(): string[] {
        return this.buffer;
    }

    public getColorBuffer(): string[] {
        return this.colorBuffer;
    }
}
