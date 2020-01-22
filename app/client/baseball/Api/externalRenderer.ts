export type TweenMax_t = {
    set(...args: unknown[]): void;
    to(...args: unknown[]): void;
    from(...args: unknown[]): void;
    killAll(...args: unknown[]): void;
};

export type THREE_t = {} & any;

export type VECTOR3 = {
    x: number;
    y: number;
    z: number;
};

export type WebGLRenderer = {
    render<T extends unknown[]>(...args: T): void;
    setSize(width: number, height: number): void;
};

export type Scene = unknown;
export type PerspectiveCamera = unknown;

declare var THREE: THREE_t;
