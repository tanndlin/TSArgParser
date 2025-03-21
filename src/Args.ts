import { ArgumentOptions } from './types';
export class Args<T> {
    constructor(
        private expectedArgs: ArgumentOptions[],
        private args: string[],
    ) {}
}
