import { ArgParser } from './ArgParser';

type Schema = {
    foo: string[];
    hello: string;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    name: 'foo',
    required: true,
    type: 'number',
    nargs: 1,
});

console.log(argParser.parse('-f 69'.split(' ')));
