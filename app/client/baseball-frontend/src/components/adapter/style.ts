export function styleAdapter(css: { [rule: string]: string }): string {
    return Object.keys(css)
        .map(k => {
            return `${k}: ${css[k]}`;
        })
        .join(';');
}
