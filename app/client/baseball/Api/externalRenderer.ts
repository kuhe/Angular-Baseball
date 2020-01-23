import * as THREE from 'three';

export { THREE };

export type TweenMax_t = {
    set(...args: unknown[]): void;
    to(...args: unknown[]): void;
    from(...args: unknown[]): void;
    killAll(...args: unknown[]): void;
};

export type VECTOR3 = {
    x: number;
    y: number;
    z: number;
} & Partial<THREE.Vector3>;
