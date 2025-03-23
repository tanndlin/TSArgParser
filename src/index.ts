import { ArgParser } from './ArgParser';

type Schema = {
    foo: string[];
    hello: string;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    name: 'foo',
    required: true,
    nargs: '*',
    default: [],
});

argParser.addArgument({
    name: 'hello',
    required: true,
    nargs: 0,
});

console.log(argParser.parse('-f bar baz --hello'.split(' ')));
