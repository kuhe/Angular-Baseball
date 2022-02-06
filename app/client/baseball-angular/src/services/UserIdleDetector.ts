/**
 * Detects user idle and highlights interactive elements.
 */
export class UserIdleDetector {
    public static idleTimeoutMs: number = 15000;

    private root: HTMLDocument = window.document;
    private lastActionTime: number = -1;
    private onIdle: number = -1;
    private events = ['click', 'scroll']

    public start(): void {
        for (const event of this.events) {
            this.root.addEventListener(event, this.listener);
        }
    }

    public stop(): void {
        for (const event of this.events) {
            this.root.removeEventListener(event, this.listener);
        }
    }

    private listener = (): void => {
        this.lastActionTime = Date.now();
        const ui = this.root.querySelectorAll('.interactive')
        for (const el of Array.from(ui)) {
            el.classList.remove('highlighted');
        }
        clearTimeout(this.onIdle);
        this.onIdle = setTimeout(this.highlightInteractiveElements, UserIdleDetector.idleTimeoutMs);
    }

    private highlightInteractiveElements = (): void => {
        const ui = this.root.querySelectorAll('.interactive')
        for (const el of Array.from(ui)) {
            el.classList.add('highlighted');
        }
    }
}

