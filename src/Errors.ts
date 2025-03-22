export class MissingArgumentError extends Error {
    constructor(arg: string) {
        super(`Missing required argument: ${arg}`);
        this.name = 'MissingFlagError';
    }
}

export class NotEnoughValuesError extends Error {
    constructor(arg: string) {
        super(`Not enough values supplied (arg: ${arg})`);
        this.name = 'NotEnoughValuesError';
    }
}
