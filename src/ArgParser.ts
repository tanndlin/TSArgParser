import {
    AmbigousArgumentError,
    MissingArgumentError,
    NotEnoughValuesError,
    UnknownShorthandError,
} from './Errors';
import { Argument } from './types';
import { hasNoArgs, prependTacks } from './utils';

export class ArgParser<T extends Record<string, any>> {
    private arguments: Argument<T>[] = [];
    private parsedArgs: T = {} as T;

    public parse(givenArgs: string[] = process.argv.slice(2)): T {
        this.replaceShorthands(givenArgs);

        this.arguments.forEach((arg) => {
            const shoulParseNoArgs = hasNoArgs(arg.nargs);
            const found = shoulParseNoArgs
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

    private parseAnyArgs(arg: Argument<T>, givenArgs: string[]): boolean {
        if (arg.nargs !== '*') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        for (let argv = 0; argv < givenArgs.length; argv++) {
            if (givenArgs[argv] === cliFlag) {
                let ret = [];
                let i = 1;
                let nextValue = givenArgs[argv + i];
                while (nextValue && !nextValue.startsWith('-')) {
                    ret.push(nextValue);
                    nextValue = givenArgs[argv + ++i];
                }

                if (!ret.length) {
                    this.parsedArgs[arg.name] = arg.default;
                } else {
                    this.parsedArgs[arg.name] = ret as T[Extract<
                        keyof T,
                        string
                    >];
                }
                return true;
            }
        }

        return false;
    }

    private parseOptionalArg(arg: Argument<T>, givenArgs: string[]): boolean {
        if (arg.nargs !== '?') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        for (let argv = 0; argv < givenArgs.length; argv++) {
            if (givenArgs[argv] === cliFlag) {
                const nextValue = givenArgs[argv + 1];
                if (!nextValue || nextValue.startsWith('-')) {
                    this.parsedArgs[arg.name as keyof T] = arg.default;
                    return true;
                }

                this.parsedArgs[arg.name as keyof T] = givenArgs[
                    argv + 1
                ] as T[keyof T];
                return true;
            }
        }

        return false;
    }

    private parseNArgs(arg: Argument<T>, givenArgs: string[]): boolean {
        if (typeof arg.nargs !== 'number') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        for (let argv = 0; argv < givenArgs.length; argv++) {
            if (givenArgs[argv] === cliFlag) {
                const nargs = arg.nargs as number;
                if (nargs > 1) {
                    const ret = [];
                    for (let i = 0; i < nargs; i++) {
                        ret.push(givenArgs[argv + i + 1]);
                    }

                    if (ret.length !== arg.nargs) {
                        throw new NotEnoughValuesError(arg.name);
                    }

                    this.parsedArgs[arg.name] = ret as T[Extract<
                        keyof T,
                        string
                    >];
                    return true;
                }

                const nextValue = givenArgs[argv + 1];
                if (!nextValue || nextValue.startsWith('-')) {
                    throw new NotEnoughValuesError(arg.name);
                }

                this.parsedArgs[arg.name as keyof T] = nextValue as T[keyof T];
                return true;
            }
        }

        return false;
    }

    private parseNoArgs(arg: Argument<T>, givenArgs: string[]) {
        const cliFlag = prependTacks(arg.name);
        if (givenArgs.includes(cliFlag)) {
            this.parsedArgs[arg.name] = true as T[Extract<keyof T, string>];
            return true;
        }

        return false;
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
}
