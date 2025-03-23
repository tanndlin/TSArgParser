import { MissingArgumentError, NotEnoughValuesError } from './Errors';
import { Argument } from './types';
import { hasNoArgs, prependTacks } from './utils';

export class ArgParser<T extends Record<string, any>> {
    private arguments: Argument[] = [];
    private parsedArgs: T = {} as T;

    public parse(givenArgs: string[] = process.argv.slice(2)): T {
        this.arguments.forEach((arg) => {
            const shoulParseNoArgs = hasNoArgs(arg);
            const found = shoulParseNoArgs
                ? this.parseNoArgs(arg, givenArgs)
                : this.parseWithArgs(arg, givenArgs);

            if (!found && arg.required) {
                throw new MissingArgumentError(arg.aliases.join(', '));
            }
        });

        return this.parsedArgs;
    }

    private parseWithArgs(arg: Argument, givenArgs: string[]): boolean {
        switch (arg.nargs) {
            case '*':
                return this.parseAnyArgs(arg, givenArgs);
            case '?':
                return this.parseOptionalArg(arg, givenArgs);
            default:
                return this.parseNArgs(arg, givenArgs);
        }
    }

    private parseAnyArgs(arg: Argument, givenArgs: string[]): boolean {
        if (arg.nargs !== '*') {
            return false;
        }

        for (const alias of arg.aliases) {
            const cliFlag = prependTacks(alias);
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
                        this.parsedArgs[alias as keyof T] =
                            arg.default as T[keyof T];
                    } else {
                        this.parsedArgs[alias as keyof T] = ret as T[keyof T];
                    }
                    return true;
                }
            }
        }

        return false;
    }

    private parseOptionalArg(arg: Argument, givenArgs: string[]): boolean {
        if (arg.nargs !== '?') {
            return false;
        }

        for (const alias of arg.aliases) {
            const cliFlag = prependTacks(alias);
            for (let argv = 0; argv < givenArgs.length; argv++) {
                if (givenArgs[argv] === cliFlag) {
                    const nextValue = givenArgs[argv + 1];
                    if (!nextValue || nextValue.startsWith('-')) {
                        this.parsedArgs[alias as keyof T] = arg.default;
                        return true;
                    }

                    this.parsedArgs[alias as keyof T] = givenArgs[
                        argv + 1
                    ] as T[keyof T];
                    return true;
                }
            }
        }

        return false;
    }

    private parseNArgs(arg: Argument, givenArgs: string[]): boolean {
        if (typeof arg.nargs !== 'number') {
            return false;
        }

        let found = false;
        for (const alias of arg.aliases) {
            const cliFlag = prependTacks(alias);

            for (let argv = 0; argv < givenArgs.length; argv++) {
                if (givenArgs[argv] === cliFlag) {
                    found = true;
                    const nargs = arg.nargs as number;
                    if (nargs > 1) {
                        const ret = [];
                        for (let i = 0; i < nargs; i++) {
                            ret.push(givenArgs[argv + i + 1]);
                        }

                        if (ret.length !== arg.nargs) {
                            throw new NotEnoughValuesError(alias);
                        }

                        this.parsedArgs[arg.aliases[0] as keyof T] =
                            ret as T[keyof T];

                        return true;
                    }

                    const nextValue = givenArgs[argv + 1];
                    if (!nextValue || nextValue.startsWith('-')) {
                        throw new NotEnoughValuesError(alias);
                    }

                    this.parsedArgs[arg.aliases[0] as keyof T] =
                        nextValue as T[keyof T];
                    return true;
                }
            }
        }

        return found;
    }

    private parseNoArgs(arg: Argument, givenArgs: string[]) {
        for (const alias of arg.aliases) {
            const cliFlag = prependTacks(alias);
            if (givenArgs.includes(cliFlag)) {
                this.parsedArgs[alias as keyof T] = true as T[keyof T];
                return true;
            }
        }

        return false;
    }

    public addArgument(arg: Argument) {
        if (arg.aliases.length === 0) {
            throw new Error('At least one alias is required');
        }

        if (arg.aliases.some((alias) => alias.length === 0)) {
            throw new Error('Alias cannot be empty');
        }

        arg.aliases.forEach((alias) => {
            if (alias.startsWith('-')) {
                throw new Error(
                    `Alias prefix tacks are implicitly added. Remove the prefix from ${alias}`,
                );
            }
        });

        this.arguments.push(arg);
    }
}
