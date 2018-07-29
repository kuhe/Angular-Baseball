export function classAdapter(conditionalNames: { [name: string]: boolean & any } & any): string {
    return Object.keys(conditionalNames)
        .map(rule => {
            if (conditionalNames[rule]) {
                return rule;
            }
            return '';
        })
        .filter(Boolean)
        .join(' ');
}
