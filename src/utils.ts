export function prependTacks(alias: string) {
    const aliasLength = alias.length;
    const tacks = aliasLength === 1 ? '-' : '--';
    return `${tacks}${alias}`;
}

export function stringToBool(value: string): boolean {
    return value.toLowerCase() === 'true' || value === '1';
}
