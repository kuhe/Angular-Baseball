import { createElement, component_t } from 'nominal-create-element.esm';

export class App {
    public element: HTMLElement;
    public template(): HTMLElement {
        return <div>hello, world</div>;
    }
}
