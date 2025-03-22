import { ArgParser } from './ArgParser';

type Schema = {
    foo: string;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    aliases: ['foo'],
    required: true,
    nargs: 1,
});

console.log(argParser.parse(['--foo', 'bar']));
