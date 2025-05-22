import { Argument, RequiredValueArgument } from './types';
export function prependTacks(alias: string) {
    const aliasLength = alias.length;
    const tacks = aliasLength === 1 ? '-' : '--';
    return `${tacks}${alias}`;
}

export function stringToBool(value: string): boolean {
    return value.toLowerCase() === 'true' || value === '1';
}

export function isRequired<S>(
    arg: Argument<S>,
): arg is RequiredValueArgument<S> {
    return typeof arg.nargs === 'number';
}
