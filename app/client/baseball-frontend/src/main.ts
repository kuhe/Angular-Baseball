import { App } from './components/app';
import * as THREE from 'three';
import * as TweenMax from 'gsap/TweenMax';

(<any>window).THREE = THREE;
(<any>window).TweenMax = TweenMax;

const $: any = (<any>window).$;

export function main(): number {
    const Baseball = (<any>window).Baseball;
    const game = new Baseball.Game();

    const app = new App(game, Baseball.util.text);

    document.body.appendChild(app.template());
    return 0;
}

(<any>window).main = main;
