import { ArgParser } from './ArgParser';

type Schema = {
    foo: string;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    name: 'foo',
    required: true,
    type: 'string',
    nargs: 2,
    choices: ['bar', 'baz'],
});

const args = argParser.parse('--foo bar baz'.split(' '));
console.log(args);
