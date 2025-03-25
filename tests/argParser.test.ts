import { ArgParser } from '../src/ArgParser';
import { parseArgs } from './testutils';

describe('Arg Parser Tests', () => {
    it('Should parse with no args', () => {
        const args = parseArgs([], '');
        expect(args).toBeDefined();
        expect(args).toStrictEqual({});
    });

    it('Should ignore unspecified args', () => {
        expect(parseArgs([], '--hello')).toStrictEqual({});

        const args = parseArgs(
            [
                {
                    name: 'foo',
                    nargs: 'flag',
                },
            ],
            '--hello',
        );
        expect(args).toStrictEqual({
            foo: false,
        });
    });

    it('Should parse a single char flag arg', () => {
        const args = parseArgs([{ name: 'f', nargs: 'flag' }], '-f');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('f');
        expect(args.f).toBe(true);
    });

    it('Should parse a singular flag arg', () => {
        const args = parseArgs([{ name: 'flag', nargs: 'flag' }], '--flag');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should parse an arg with value', () => {
        const args = parseArgs([{ name: 'foo', nargs: 1 }], '--foo bar');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe('bar');
    });

    it('Should parse an arg with number value', () => {
        const args = parseArgs([{ name: 'foo', nargs: 1 }], '--foo 69');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe(69);
    });

    it('Should parse an arg with value', () => {
        const args = parseArgs([{ name: 'foo', nargs: 2 }], '--foo bar baz');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBeInstanceOf(Array);
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse an arg with specified optional ? value', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    nargs: '?',
                    default: 'baz',
                },
            ],
            '--foo bar',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should default when optional arg not specified with narg=1', () => {
        const args = parseArgs(
            [
                {
                    name: 'numIterations',
                    nargs: 1,
                },
                {
                    name: 'phrase',
                    nargs: '?',
                    default: 'Hello World!',
                },
            ],
            '--numIterations 5',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('phrase');
        expect(args.phrase).toStrictEqual('Hello World!');
    });

    it('Should default when optional arg not specified with narg=?', () => {
        const args = parseArgs(
            [
                {
                    name: 'numIterations',
                    nargs: 1,
                },
                {
                    name: 'phrase',
                    nargs: '?',
                    default: 'Hello World!',
                },
            ],
            '--numIterations 5',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('phrase');
        expect(args.phrase).toStrictEqual('Hello World!');
    });

    it('Should default when optional arg specified with no value with narg=?', () => {
        const args = parseArgs(
            [
                {
                    name: 'numIterations',
                    nargs: 1,
                },
                {
                    name: 'phrase',
                    nargs: '?',
                    default: 'Hello World!',
                },
            ],
            '--numIterations 5 --phrase',
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
                    nargs: 1,

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
                    nargs: 2,

                    choices: ['bar', 'baz', 'fun'],
                },
            ],
            '--foo bar fun',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual(['bar', 'fun']);
    });

    it('Should handle boolean conversion for non-flag arguments', () => {
        const args = parseArgs<{
            enabled: boolean;
        }>([{ name: 'enabled', nargs: 'flag' }], '--enabled true');
        expect(typeof args.enabled).toBe('boolean');
        expect(args.enabled).toBe(true);

        const args2 = parseArgs(
            [{ name: 'enabled', nargs: 1 }],
            '--enabled false',
        );
        expect(args2.enabled).toBe(false);
    });

    it('Should handle large nargs values', () => {
        const args = parseArgs<{
            values: string[];
        }>([{ name: 'values', nargs: 5 }], '--values a b c d e');
        expect(args.values).toEqual(['a', 'b', 'c', 'd', 'e']);
        expect(args.values.length).toBe(5);
    });

    it('Should validate each value in array against choices for nargs=*', () => {
        const args = parseArgs(
            [
                {
                    name: 'modes',
                    nargs: '*',

                    choices: ['dev', 'prod', 'test'],
                    default: [],
                },
            ],
            '--modes dev test prod',
        );
        expect(args.modes).toEqual(['dev', 'test', 'prod']);

        expect(() =>
            parseArgs(
                [
                    {
                        name: 'modes',
                        nargs: '*',

                        choices: ['dev', 'prod', 'test'],
                        default: [],
                    },
                ],
                '--modes dev invalid test',
            ),
        ).toThrow('Invalid choice for argument modes');
    });

    it('Should handle multiple arguments with proper types', () => {
        const args = parseArgs<{
            name: string;
            age: number;
            active: boolean;
        }>(
            [
                { name: 'name', nargs: 1 },
                { name: 'age', nargs: 1 },
                {
                    name: 'active',
                    nargs: 'flag',
                },
            ],
            '--name John --age 30 --active',
        );
        expect(args.name).toBe('John');
        expect(args.age).toBe(30);
        expect(args.active).toBe(true);
        expect(typeof args.age).toBe('number');
        expect(typeof args.active).toBe('boolean');
    });

    it('Should parse args when using process.argv', () => {
        const originalArgv = process.argv;
        process.argv = ['node', 'script.js', '--test', 'value'];

        const parser = new ArgParser<{
            test: string;
        }>([{ name: 'test', nargs: 1 }]);
        const args = parser.parse();
        expect(args.test).toBe('value');

        process.argv = originalArgv; // restore original argv
    });
});
