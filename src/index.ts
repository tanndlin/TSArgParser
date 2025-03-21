import { ArgParser } from './ArgParser';

const argParser = new ArgParser();
argParser.addArgument({
    aliases: ['flag'],
});

console.log(argParser.parse(['--flag']));
