import { App } from "./components/app";

export function main(): number {
    document.body.appendChild(new App().template());
    return 0;
}