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

export class DuplicateArgumentError extends Error {
    constructor(arg: string) {
        super(`Duplicate args specified to ArgParser (arg: ${arg})`);
        this.name = 'DuplicateArgumentError';
    }
}

export class DuplicateCLIArgumentError extends Error {
    constructor(arg: string) {
        super(`Duplicate args specified in command line (arg: ${arg})`);
        this.name = 'DuplicateCLIArgumentError';
    }
}
