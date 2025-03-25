import { parseArgs } from '../tests/testutils';

const args = parseArgs(
    [
        {
            name: 'numbers',
            nargs: '*',
            default: [],
        },
    ],
    '--numbers 1 2 3',
);
console.log(args);
