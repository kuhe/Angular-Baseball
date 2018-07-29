import { App } from './components/app';

export function main(): number {
    const Baseball = (<any>window).Baseball;
    const game = new Baseball.Game();

    const app = new App(game, Baseball.util.text);

    document.body.appendChild(app.template());
    return 0;
}

(<any>window).main = main;
