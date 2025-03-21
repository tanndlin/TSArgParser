export class MissingArgumentError extends Error {
    constructor(arg: string) {
        super(`Missing required argument: ${arg}`);
        this.name = 'MissingFlagError';
    }
}
