import { Argument } from './types';
export class Args<T> {
    constructor(
        private expectedArgs: Argument[],
        private args: string[],
    ) {}
}
