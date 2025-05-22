import { ArgParser } from '../src/ArgParser';
import { Argument } from './../src/types';

export function parseArgs<S>(args: Argument<S>[], cliArgs: string): S {
    return new ArgParser<S>(args).parse(cliArgs.split(' '));
}
