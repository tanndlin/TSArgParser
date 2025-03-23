export class MissingArgumentError extends Error {
    constructor(arg: string) {
        super(`Missing required argument: ${arg}`);
        this.name = 'MissingArgumentError';
    }
}

export class NotEnoughValuesError extends Error {
    constructor(arg: string) {
        super(`Not enough values supplied (arg: ${arg})`);
        this.name = 'NotEnoughValuesError';
    }
}

export class AmbigousArgumentError extends Error {
    constructor(args: string[]) {
        super(
            `Cannot use ambiguous shorthand -${args[0].at(0)} (possible args: ${args.join(', ')})`,
        );
        this.name = 'AmbiguousArgumentError';
    }
}

export class UnknownShorthandError extends Error {
    constructor(flag: string) {
        super(`Unknown shorthand -${flag}`);
        this.name = 'UnknownShorthandError';
    }
}
