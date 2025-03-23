import { ArgParser } from './ArgParser';

type Schema = {
    foo: string;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    aliases: ['foo'],
    required: true,
    nargs: '?',
    default: 'baz',
});

console.log(argParser.parse('--foo bar'.split(' ')));
