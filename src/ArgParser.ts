import {
    AmbigousArgumentError,
    DuplicateArgumentError,
    DuplicateCLIArgumentError,
    InvalidChoiceError,
    MissingArgumentError,
    NotEnoughValuesError,
    UnknownShorthandError,
} from './Errors';
import { Argument } from './types';
import { hasNoArgs, prependTacks, stringToBool } from './utils';

export class ArgParser<T extends Record<string, any>> {
    private arguments: Argument<T>[];
    private parsedArgs: T;

    constructor(args: Argument<T>[] = []) {
        this.arguments = [];
        args.forEach((arg) => this.addArgument(arg));

        this.parsedArgs = {} as T;
    }

    public parse(givenArgs: string[] = process.argv.slice(2)): T {
        this.replaceShorthands(givenArgs);
        this.checkDuplicateCLIArguments(givenArgs);

        this.arguments.forEach((arg) => {
            const shouldParseNoArgs = hasNoArgs(arg.nargs);
            const found = shouldParseNoArgs
                ? this.parseNoArgs(arg, givenArgs)
                : this.parseWithArgs(arg, givenArgs);

            if (!found && arg.required) {
                throw new MissingArgumentError(arg.name);
            }
        });

        return this.parsedArgs;
    }

    private parseWithArgs(arg: Argument<T>, givenArgs: string[]): boolean {
        switch (arg.nargs) {
            case '*':
                return this.parseAnyArgs(arg, givenArgs);
            case '?':
                return this.parseOptionalArg(arg, givenArgs);
            default:
                return this.parseNArgs(arg, givenArgs);
        }
    }

    private getCliFlagIndex(cliFlag: string, givenArgs: string[]): number {
        return givenArgs.findIndex((arg) => arg === cliFlag);
    }

    private getNextValues(
        index: number,
        givenArgs: string[],
        nargs: number,
    ): string[] {
        const values = [];
        for (let i = 1; i <= nargs; i++) {
            const value = givenArgs[index + i];
            if (!value || value.startsWith('-')) {
                break;
            }
            values.push(value);
        }
        return values;
    }

    private parseAnyArgs(arg: Argument<T>, givenArgs: string[]): boolean {
        if (arg.nargs !== '*') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        const index = this.getCliFlagIndex(cliFlag, givenArgs);
        if (index === -1) {
            return false;
        }

        const values = this.getNextValues(index, givenArgs, Infinity);
        if (!values.length) {
            this.setParsedArg(arg, arg.default);
        } else {
            this.setParsedArg(arg, values as T[keyof T]);
        }

        return true;
    }

    private parseOptionalArg(arg: Argument<T>, givenArgs: string[]): boolean {
        if (arg.nargs !== '?') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        const index = this.getCliFlagIndex(cliFlag, givenArgs);
        if (index === -1) {
            this.setParsedArg(arg, arg.default);
            return true;
        }

        const [value] = this.getNextValues(index, givenArgs, 1);
        if (!value) {
            this.setParsedArg(arg, arg.default);
        } else {
            this.setParsedArg(arg, value as T[keyof T]);
        }
        return true;
    }

    private parseNArgs(arg: Argument<T>, givenArgs: string[]): boolean {
        if (typeof arg.nargs !== 'number') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        const index = this.getCliFlagIndex(cliFlag, givenArgs);
        if (index === -1) {
            if (!arg.required) {
                this.setParsedArg(arg, arg.default as T[keyof T]);
            }
            return false;
        }

        const values = this.getNextValues(index, givenArgs, arg.nargs);
        if (values.length !== arg.nargs) {
            throw new NotEnoughValuesError(arg.name);
        }

        this.setParsedArg(
            arg,
            values.length > 1
                ? (values as T[keyof T])
                : (values[0] as T[keyof T]),
        );
        return true;
    }

    private parseNoArgs(arg: Argument<T>, givenArgs: string[]) {
        const cliFlag = prependTacks(arg.name);
        if (givenArgs.includes(cliFlag)) {
            this.setParsedArg(arg, true as T[keyof T]);
            return true;
        }

        return false;
    }

    private validateChoices(arg: Argument<T>, value: any): void {
        if (!arg.choices) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((val: any) => {
                if (!arg.choices!.includes(val)) {
                    throw new InvalidChoiceError(
                        arg.name,
                        arg.choices as string[],
                    );
                }
            });
        } else if (!arg.choices.includes(value)) {
            throw new InvalidChoiceError(arg.name, arg.choices as string[]);
        }
    }

    private convertSingleValue(value: any, type: string): any {
        if (type === 'number') {
            return Number(value);
        } else if (type === 'boolean') {
            return stringToBool(`${value}`);
        }
        return value;
    }

    private convertType(arg: Argument<T>, value: any): T[keyof T] {
        const isArrayType =
            arg.nargs === '*' ||
            (typeof arg.nargs === 'number' && arg.nargs > 1);

        if (isArrayType && Array.isArray(value)) {
            return value.map((val) =>
                this.convertSingleValue(val, arg.type),
            ) as T[keyof T];
        }

        return this.convertSingleValue(value, arg.type) as T[keyof T];
    }

    private setParsedArg(arg: Argument<T>, value: T[keyof T]) {
        this.validateChoices(arg, value);
        const convertedValue = this.convertType(arg, value);
        this.parsedArgs[arg.name as keyof T] = convertedValue;
    }

    public addArgument(arg: Argument<T>) {
        if (arg.name.length === 0) {
            throw new Error('At least one alias is required');
        }

        if (!arg.name) {
            throw new Error('Alias cannot be empty');
        }

        if (arg.name.startsWith('-')) {
            throw new Error(
                `Alias prefix tacks are implicitly added. Remove the prefix from ${arg.name}`,
            );
        }

        if (this.arguments.some((a) => a.name === arg.name)) {
            throw new DuplicateArgumentError(arg.name);
        }

        this.arguments.push(arg);
    }

    private replaceShorthands(givenArgs: string[]) {
        const flags = givenArgs
            .filter((arg) => /^-\w$/.test(arg))
            .map((arg) => arg.at(1)!);

        const matches = flags.map((flag) => {
            return {
                flag,
                matches: this.arguments.filter(
                    (arg) => arg.name.at(0) === flag,
                ),
            };
        });

        // Throw for ambiguous
        matches
            .filter((m) => m.matches.length > 1)
            .forEach((m) => {
                throw new AmbigousArgumentError(
                    m.matches.map((arg) => arg.name),
                );
            });

        // Throw for unknown
        matches
            .filter((m) => !m.matches.length)
            .forEach((m) => {
                throw new UnknownShorthandError(m.flag);
            });

        matches.forEach((matches) => {
            const { flag } = matches;
            const [match] = matches.matches;
            givenArgs
                .map((arg, index) => ({ arg, index }))
                .filter((arg) => arg.arg === prependTacks(flag))
                .forEach(
                    (arg) => (givenArgs[arg.index] = prependTacks(match.name)),
                );
        });
    }

    public checkDuplicateCLIArguments(givenArgs: string[]) {
        const args = givenArgs.filter((arg) => arg.startsWith('--'));
        const duplicates = args.filter((arg, index) => {
            return args.indexOf(arg) !== index;
        });

        if (duplicates.length) {
            throw new DuplicateCLIArgumentError(duplicates.join(', '));
        }
    }
}
