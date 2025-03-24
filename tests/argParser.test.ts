import { ArgParser } from '../src/ArgParser';
import { parseArgs } from './testutils';

describe('Arg Parser Tests', () => {
    it('Should parse with no args', () => {
        const args = parseArgs([], '');
        expect(args).toBeDefined();
        expect(args).toStrictEqual({});
    });

    it('Should ignore unspecified args', () => {
        const args = parseArgs(
            [
                {
                    name: 'flag',
                    required: false,
                    nargs: 0,
                    type: 'boolean',
                    default: false,
                },
            ],
            '--hello',
        );
        expect(args).toStrictEqual({});
    });

    it('Should disallow leading tacks', () => {
        const parser = new ArgParser();
        expect(() =>
            parser.addArgument({
                name: '--flag',
                required: true,
                nargs: 0,
                type: 'boolean',
            }),
        ).toThrow(
            'Alias prefix tacks are implicitly added. Remove the prefix from --flag',
        );
    });

    it('Should parse a single char flag arg', () => {
        const args = parseArgs(
            [{ name: 'f', required: true, nargs: 0, type: 'boolean' }],
            '-f',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('f');
        expect(args.f).toBe(true);
    });

    it('Should parse a singular flag arg', () => {
        const args = parseArgs(
            [{ name: 'flag', required: true, nargs: 0, type: 'boolean' }],
            '--flag',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should throw for missing required arg', () => {
        expect(() =>
            parseArgs(
                [{ name: 'flag', required: true, nargs: 0, type: 'boolean' }],
                '--hello --world',
            ),
        ).toThrow('Missing required argument: flag');
    });

    it('Should parse an arg with value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: 1, type: 'string' }],
            '--foo bar',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe('bar');
    });

    it('Should parse an arg with number value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: 1, type: 'number' }],
            '--foo 69',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe(69);
    });

    it('Should parse an arg with value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: 2, type: 'string' }],
            '--foo bar baz',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBeInstanceOf(Array);
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse an arg with not specified optional ? value', () => {
        const args = parseArgs<{
            foo: string;
        }>(
            [
                {
                    name: 'foo',
                    required: true,
                    nargs: '?',
                    default: 'bar',
                    type: 'string',
                },
            ],
            '--foo',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should parse an arg with specified optional ? value', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    required: true,
                    nargs: '?',
                    default: 'baz',
                    type: 'string',
                },
            ],
            '--foo bar',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should parse rest of args for * nargs', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    required: true,
                    nargs: '*',
                    default: [],
                    type: 'string',
                },
            ],
            '--foo bar baz',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse rest of args for * nargs with following arg', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    required: true,
                    nargs: '*',
                    default: [],
                    type: 'string',
                },
                { name: 'hello', required: true, nargs: 0, type: 'boolean' },
            ],
            '--foo bar baz --hello',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args).toHaveProperty('hello');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should default when optional arg not specified', () => {
        const args = parseArgs(
            [
                {
                    name: 'numIterations',
                    required: true,
                    nargs: 1,
                    type: 'number',
                },
                {
                    name: 'phrase',
                    required: false,
                    nargs: 1,
                    default: 'Hello World!',
                    type: 'string',
                },
            ],
            '--numIterations 5',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('phrase');
        expect(args.phrase).toStrictEqual('Hello World!');
    });

    it('Should default when optional arg not specified', () => {
        const args = parseArgs(
            [
                {
                    name: 'numIterations',
                    required: true,
                    nargs: 1,
                    type: 'number',
                },
                {
                    name: 'phrase',
                    required: false,
                    nargs: '?',
                    default: 'Hello World!',
                    type: 'string',
                },
            ],
            '--numIterations 5',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('phrase');
        expect(args.phrase).toStrictEqual('Hello World!');
    });

    it('Should allow correct choices', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    required: true,
                    nargs: 1,
                    type: 'string',
                    choices: ['bar', 'baz'],
                },
            ],
            '--foo bar',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should allow multiple correct choices', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    required: true,
                    nargs: 2,
                    type: 'string',
                    choices: ['bar', 'baz', 'fun'],
                },
            ],
            '--foo bar fun',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual(['bar', 'fun']);
    });

    it('Should disallow incorrect choices', () => {
        expect(() =>
            parseArgs(
                [
                    {
                        name: 'foo',
                        required: true,
                        nargs: 2,
                        type: 'string',
                        choices: ['bar', 'baz'],
                    },
                ],
                '--foo fun',
            ),
        ).toThrow('Invalid choice for argument foo (choices: bar, baz)');
    });

    it('Should throw for an arg with missing value', () => {
        expect(() =>
            parseArgs(
                [{ name: 'foo', required: true, nargs: 1, type: 'string' }],
                '--foo',
            ),
        ).toThrow('Not enough values supplied (arg: foo)');
    });

    it('Should throw duplicate parser args', () => {
        expect(() =>
            parseArgs(
                [
                    { name: 'foo', required: true, nargs: 0, type: 'boolean' },
                    { name: 'foo', required: true, nargs: 0, type: 'boolean' },
                ],
                '--foo',
            ),
        ).toThrow('Duplicate args specified to ArgParser (arg: foo)');
    });

    it('Should throw duplicate given args', () => {
        expect(() =>
            parseArgs(
                [{ name: 'foo', required: true, nargs: 0, type: 'boolean' }],
                '--foo --foo',
            ),
        ).toThrow('Duplicate args specified in command line (arg: --foo)');
    });
});
