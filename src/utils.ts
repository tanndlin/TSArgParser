import { NArgs } from './types';

export function hasNoArgs(nargs: NArgs): boolean {
    return nargs === undefined || nargs === 0;
}

export function prependTacks(alias: string) {
    const aliasLength = alias.length;
    const tacks = aliasLength === 1 ? '-' : '--';
    return `${tacks}${alias}`;
}
