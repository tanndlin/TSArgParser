import { MissingArgumentError } from './Errors';
import { Argument } from './types';
import { hasNoArgs } from './utils';

export class ArgParser<T> {
    private arguments: Argument[] = [];

    public parse(givenArgs: string[] = process.argv.slice(2)): T {
        const parsedArgs = {} as T;
        this.arguments.forEach((arg) => {
            let found = false;
            // Parse flag arguments
            const shoulParseNoArgs = hasNoArgs(arg);
            if (shoulParseNoArgs) {
                found = this.parseNoArgs(arg, givenArgs, parsedArgs);
            }

            if (!found && arg.required) {
                throw new MissingArgumentError(arg.aliases.join(', '));
            }
        });

        return parsedArgs;
    }

    private parseNoArgs(arg: Argument, givenArgs: string[], parsedArgs: T) {
        for (const alias of arg.aliases) {
            const aliasLength = alias.length;
            const tacks = aliasLength === 1 ? '-' : '--';
            const cliFlag = `${tacks}${alias}`;

            if (givenArgs.includes(cliFlag)) {
                parsedArgs[alias as keyof T] = true as T[keyof T];
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
