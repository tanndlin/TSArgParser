import { ArgParser } from './ArgParser';

type Schema = {
    flag: boolean;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    aliases: ['flag'],
    required: true,
});

console.log(argParser.parse(['--flag']));
