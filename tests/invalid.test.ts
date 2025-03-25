import { ArgParser } from '../src/ArgParser';
import { parseArgs } from './testutils';

describe('Invalid state tests', () => {
    it('Should disallow leading tacks', () => {
        const parser = new ArgParser();
        expect(() =>
            parser.addArgument({
                name: '--flag',
                nargs: 'flag',
            }),
        ).toThrow(
            'Alias prefix tacks are implicitly added and thus should not contain them. (arg: --flag)',
        );
    });

    it('Should throw for missing required arg', () => {
        expect(() =>
            parseArgs(
                [
                    {
                        name: 'flag',
                        nargs: 1,
                    },
                ],
                '--hello --world',
            ),
        ).toThrow('Missing required argument: flag');
    });

    it('Should disallow incorrect choices', () => {
        expect(() =>
            parseArgs(
                [
                    {
                        name: 'foo',
                        nargs: 1,
                        choices: ['bar', 'baz'],
                    },
                ],
                '--foo fun',
            ),
        ).toThrow('Invalid choice for argument foo (choices: bar, baz)');
    });

    it('Should enforce numeric choices', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    nargs: 1,
                    choices: [1, 2, 3],
                },
            ],
            '--foo 2',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual(2);
    });

    it('Should throw for an arg with missing value', () => {
        expect(() => parseArgs([{ name: 'foo', nargs: 1 }], '--foo')).toThrow(
            'Not enough values supplied (arg: foo)',
        );
    });

    it('Should throw duplicate parser args', () => {
        expect(() =>
            parseArgs(
                [
                    {
                        name: 'foo',
                        nargs: 'flag',
                    },
                    {
                        name: 'foo',
                        nargs: 'flag',
                    },
                ],
                '--foo',
            ),
        ).toThrow('Duplicate args specified to ArgParser (arg: foo)');
    });

    it('Should throw duplicate given args', () => {
        expect(() =>
            parseArgs(
                [
                    {
                        name: 'foo',
                        nargs: 'flag',
                    },
                ],
                '--foo --foo',
            ),
        ).toThrow('Duplicate args specified in command line (arg: --foo)');
    });

    it('Should throw for empty name', () => {
        const parser = new ArgParser();
        expect(() =>
            parser.addArgument({
                name: '',
                nargs: 1,
            }),
        ).toThrow('Alias cannot be empty (arg: )');
    });
});
