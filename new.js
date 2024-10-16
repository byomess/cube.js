const keypress = require('keypress');
const width = 100;
const height = 40;
const zBuffer = new Array(width * height).fill(0);
const buffer = new Array(width * height).fill('.');
const prevBuffer = new Array(width * height).fill('.');
const colorBuffer = new Array(width * height).fill('');
const backgroundASCIICode = ' ';
const distanceFromCam = 100;
const K1 = 40;
const incrementSpeed = 0.6;
let horizontalOffset = 0;
let A = 0, B = 0, C = 0;
const cubeWidth = 20;
const damping = 0.998;
let sinA = 0, cosA = 0, sinB = 0, cosB = 0, sinC = 0, cosC = 0;
let lastMouseUpdateTime = Date.now();
let lastTime = Date.now();
let deltaMS = 0;
let deltaTime = 0;
let lastMouseX = 0, lastMouseY = 0;
let mouseX = 0, mouseY = 0;
const FPS = 60;
const TIME_TO_UPDATE_MOUSE = 1000 / FPS * 3;
const DRAG_FACTOR = 0.2;
const angVelFactor = DRAG_FACTOR * 0.01;
let angularVelA = (Math.random() - 0.5) * 2 * angVelFactor;
let angularVelB = (Math.random() - 0.5) * 2 * angVelFactor;
let angularVelC = 0;
const precomputeTrigonometry = () => {
    sinA = Math.sin(A);
    cosA = Math.cos(A);
    sinB = Math.sin(B);
    cosB = Math.cos(B);
    sinC = Math.sin(C);
    cosC = Math.cos(C);
};
const getCharacterForIntensity = (intensity) => {
    // 10 characters for 10 levels of light intensity
    const CHARS = ' .:=+*o%#@';
    const index = Math.floor(intensity * CHARS.length);
    return CHARS[index] || ' ';
};
const getColorForFace = (face, intensity) => {
    const colors = {
        'front': ['\x1b[38;5;196m', '\x1b[38;5;160m', '\x1b[38;5;124m'],
        'right': ['\x1b[38;5;46m', '\x1b[38;5;40m', '\x1b[38;5;34m'],
        'left': ['\x1b[38;5;33m', '\x1b[38;5;27m', '\x1b[38;5;21m'],
        'back': ['\x1b[38;5;226m', '\x1b[38;5;220m', '\x1b[38;5;214m'],
        'top': ['\x1b[38;5;99m', '\x1b[38;5;93m', '\x1b[38;5;89m'],
        'bottom': ['\x1b[38;5;207m', '\x1b[38;5;204m', '\x1b[38;5;201m']
    };
    if (intensity > 0.66)
        return colors[face][0];
    if (intensity > 0.33)
        return colors[face][1];
    return colors[face][2];
};
const calculateX = (i, j, k) => j * sinA * sinB * cosC - k * cosA * sinB * cosC + j * cosA * sinC + k * sinA * sinC + i * cosB * cosC;
const calculateY = (i, j, k) => j * cosA * cosC + k * sinA * cosC - j * sinA * sinB * sinC + k * cosA * sinB * sinC - i * cosB * sinC;
const calculateZ = (i, j, k) => k * cosA * cosB - j * sinA * cosB + i * sinB;
const calculateFaceNormal = (cubeX, cubeY, cubeZ) => {
    if (cubeZ === cubeWidth)
        return [0, 0, 1, 'front'];
    if (cubeZ === -cubeWidth)
        return [0, 0, -1, 'back'];
    if (cubeX === cubeWidth)
        return [1, 0, 0, 'right'];
    if (cubeX === -cubeWidth)
        return [-1, 0, 0, 'left'];
    if (cubeY === cubeWidth)
        return [0, 1, 0, 'top'];
    if (cubeY === -cubeWidth)
        return [0, -1, 0, 'bottom'];
    return [0, 0, 0, ''];
};
const rotateNormal = (nx, ny, nz) => {
    const rotatedX = calculateX(nx, ny, nz);
    const rotatedY = calculateY(nx, ny, nz);
    const rotatedZ = calculateZ(nx, ny, nz);
    return [rotatedX, rotatedY, rotatedZ];
};
const calculateForSurface = (cubeX, cubeY, cubeZ) => {
    const x = calculateX(cubeX, cubeY, cubeZ);
    const y = calculateY(cubeX, cubeY, cubeZ);
    const z = calculateZ(cubeX, cubeY, cubeZ) + distanceFromCam;
    const ooz = 1 / z;
    const xp = Math.floor(width / 2 + horizontalOffset + K1 * ooz * x * 2);
    const yp = Math.floor(height / 2 + K1 * ooz * y);
    const idx = xp + yp * width;
    if (idx >= 0 && idx < width * height && ooz > zBuffer[idx]) {
        zBuffer[idx] = ooz;
        let [nx, ny, nz, face] = calculateFaceNormal(cubeX, cubeY, cubeZ);
        [nx, ny, nz] = rotateNormal(nx, ny, nz);
        const lightDirection = [0, 0, -1];
        const intensity = nx * lightDirection[0] + ny * lightDirection[1] + nz * lightDirection[2];
        const lightIntensity = Math.max(0, intensity);
        const character = getCharacterForIntensity(lightIntensity);
        const color = getColorForFace(face, lightIntensity);
        buffer[idx] = character;
        colorBuffer[idx] = color;
    }
};
const updateDisplay = () => {
    let output = "";
    for (let k = 0; k < width * height; k++) {
        // if (buffer[k] !== prevBuffer[k]) {
        const row = Math.floor(k / width);
        const col = k % width;
        output += `\x1b[${row + 1};${col + 1}H${colorBuffer[k]}${buffer[k]}\x1b[0m`;
        prevBuffer[k] = buffer[k];
        // }
    }
    process.stdout.write(output);
};
const main = async () => {
    buffer.fill(backgroundASCIICode);
    colorBuffer.fill('');
    zBuffer.fill(0);
    precomputeTrigonometry();
    for (let cubeX = -cubeWidth; cubeX < cubeWidth; cubeX += incrementSpeed) {
        for (let cubeY = -cubeWidth; cubeY < cubeWidth; cubeY += incrementSpeed) {
            calculateForSurface(cubeX, cubeY, -cubeWidth);
            calculateForSurface(cubeWidth, cubeY, cubeX);
            calculateForSurface(-cubeWidth, cubeY, -cubeX);
            calculateForSurface(-cubeX, cubeY, cubeWidth);
            calculateForSurface(cubeX, -cubeWidth, -cubeY);
            calculateForSurface(cubeX, cubeWidth, cubeY);
        }
    }
    updateDisplay();
};
const setupInteractiveMode = () => {
    keypress(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('keypress', (ch, key) => {
        if (key && key.ctrl && key.name === 'c') {
            process.exit();
        }
    });
    process.stdin.on('mousepress', (info) => {
        let event = '';
        if (info.name === 'mouse' && info.button === 0 && !info.release)
            event = 'mousedown';
        if (info.name === 'mouse' && info.release && info.scroll === 0)
            event = 'mouseup';
        if (info.name === 'mouse' && info.scroll === -1 && !info.release)
            event = 'mousedrag';
        mouseX = info.x;
        mouseY = info.y;
        switch (event) {
            case "mousedrag":
                const deltaX = info.x - lastMouseX;
                const deltaY = info.y - lastMouseY;
                A -= deltaY * (Math.PI / 180) * 8 * DRAG_FACTOR;
                B += deltaX * (Math.PI / 180) * 4 * DRAG_FACTOR;
                // angularVelA += deltaY * angVelFactor * DRAG_FACTOR;
                // angularVelB += deltaX * angVelFactor * DRAG_FACTOR;
                A = A % (Math.PI * 2);
                B = B % (Math.PI * 2);
                C = C % (Math.PI * 2);
                break;
            case "mousedown":
                angularVelA = 0;
                angularVelB = 0;
                // angularVelC = 0;
                // lastMouseX = info.x;
                // lastMouseY = info.y;
                break;
            case "mouseup":
                const dx = mouseX - lastMouseX;
                const dy = mouseY - lastMouseY;
                angularVelA = dy * angVelFactor;
                angularVelB = dx * angVelFactor;
                break;
        }
    });
    process.stdout.write('\x1b[?1003h');
    setInterval(() => {
        const currentTime = Date.now();
        const timePerFrame = 1000 / FPS;
        deltaMS = currentTime - lastTime;
        deltaTime = deltaMS / timePerFrame;
        // A -= deltaY * (Math.PI / 180) * 8 * DRAG_FACTOR;
        // B += deltaX * (Math.PI / 180) * 4 * DRAG_FACTOR;
        // A = A % (Math.PI * 2);
        // B = B % (Math.PI * 2);
        // C = C % (Math.PI * 2);
        A -= angularVelA * (Math.PI / 180) * 8 * 100;
        B += angularVelB * (Math.PI / 180) * 4 * 100;
        A = A % (Math.PI * 2);
        B = B % (Math.PI * 2);
        angularVelA *= damping;
        angularVelB *= damping;
        // angularVelC *= damping;
        const timeSinceLastMouseUpdate = currentTime - lastMouseUpdateTime;
        if (timeSinceLastMouseUpdate > TIME_TO_UPDATE_MOUSE) {
            lastMouseX = mouseX;
            lastMouseY = mouseY;
            lastMouseUpdateTime = currentTime;
        }
        main();
        lastTime = currentTime;
    }, 1000 / FPS);
};
setupInteractiveMode();
