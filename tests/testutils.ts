import { ArgParser } from '../src/ArgParser';
import { Argument, Schema } from './../src/types';
export function parseArgs<T extends Schema>(
    args: Argument<T>[],
    cliArgs: string,
) {
    return new ArgParser<T>(args).parse(cliArgs.split(' '));
}
