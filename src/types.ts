export interface IKeyPress {
    name: string;
    ctrl: boolean;
}

export interface IMousePress {
    name: string;
    button: number;
    release: boolean;
    scroll?: number;
    x: number;
    y: number;
}

export interface IEloqubeConfig {
    WIDTH: number;
    HEIGHT: number;
    CUBE_WIDTH: number;
    INCREMENT_SPEED: number;
    DRAG_FACTOR: number;
    K1: number;
    DISTANCE_FROM_CAM: number;
    CHARS: string;
    COLORS: Record<string, string[]>;
    BACKGROUND_CHAR: string;
}