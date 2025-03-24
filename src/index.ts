import { ArgParser } from './ArgParser';

type Schema = {
    numIterations: number;
    phrase: string;
};

const argParser = new ArgParser<Schema>();
argParser.addArgument({
    name: 'numIterations',
    required: true,
    type: 'number',
    nargs: 1,
});

argParser.addArgument({
    name: 'phrase',
    required: false,
    type: 'string',
    nargs: '?',
    default: 'Hello World!',
});

const args = argParser.parse();
console.log(args);

for (let i = 0; i < args.numIterations; i++) {
    console.log(args.phrase);
}
