import { Argument, RequiredValueArgument, Schema } from './types';
export function prependTacks(alias: string) {
    const aliasLength = alias.length;
    const tacks = aliasLength === 1 ? '-' : '--';
    return `${tacks}${alias}`;
}

export function stringToBool(value: string): boolean {
    return value.toLowerCase() === 'true' || value === '1';
}

export function isRequired<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
>(arg: Argument<S, K>): arg is RequiredValueArgument<S, K> {
    return typeof arg.nargs === 'number';
}
