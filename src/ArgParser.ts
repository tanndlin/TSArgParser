import { ArgumentOptions } from './types';

export class ArgParser<T> {
    private arguments: ArgumentOptions[] = [];

    public parse(givenArgs: string[] = process.argv.slice(2)): T {
        const parsedArgs = {} as T;
        this.arguments.forEach((arg) => {
            let found = false;
            // Parse flag arguments
            const isFlag = arg.nargs === undefined;
            if (isFlag) {
                found = this.parseFlags(arg, givenArgs, parsedArgs);
            }

            if (!found && arg.required) {
                throw new Error(
                    `Missing required argument: ${arg.aliases.join(', ')}`,
                );
            }
        });

        return parsedArgs;
    }

    private parseFlags(
        arg: ArgumentOptions,
        givenArgs: string[],
        parsedArgs: T,
    ) {
        arg.aliases.forEach((alias) => {
            const aliasLength = alias.length;
            const tacks = aliasLength === 1 ? '-' : '--';
            const cliFlag = `${tacks}${alias}`;

            if (givenArgs.includes(cliFlag)) {
                parsedArgs[alias as keyof T] = true as T[keyof T];
                return true;
            }
        });

        return false;
    }

    public addArgument(arg: ArgumentOptions) {
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
