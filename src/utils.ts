import { Argument } from './types';

export function hasNoArgs(arg: Argument): boolean {
    if (arg.nargs === undefined || arg.nargs === 0) {
        return true;
    }

    return false;
}
