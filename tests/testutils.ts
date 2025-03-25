import { ArgParser } from '../src/ArgParser';
import { Argument, Schema } from './../src/types';

export function parseArgs<S extends Schema>(
    args: Argument<S, Extract<keyof S, string>>[],
    cliArgs: string,
) {
    return new ArgParser<S>(args).parse(cliArgs.split(' '));
}
