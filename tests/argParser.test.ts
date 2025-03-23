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
            [{ name: 'flag', required: false, nargs: 0 }],
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
            }),
        ).toThrow(
            'Alias prefix tacks are implicitly added. Remove the prefix from --flag',
        );
    });

    it('Should parse a single char flag arg', () => {
        const args = parseArgs([{ name: 'f', required: true, nargs: 0 }], '-f');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('f');
        expect(args.f).toBe(true);
    });

    it('Should parse a singular flag arg', () => {
        const args = parseArgs(
            [{ name: 'flag', required: true, nargs: 0 }],
            '--flag',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should throw for missing required arg', () => {
        expect(() =>
            parseArgs(
                [{ name: 'flag', required: true, nargs: 0 }],
                '--hello --world',
            ),
        ).toThrow('Missing required argument: flag');
    });

    it('Should parse an arg with value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: 1 }],
            '--foo bar',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe('bar');
    });

    it('Should parse an arg with number value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: 1 }],
            '--foo 69',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe(69);
    });

    it('Should parse an arg with value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: 2 }],
            '--foo bar baz',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBeInstanceOf(Array);
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse an arg with not specified optional ? value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: '?', default: 'bar' }],
            '--foo',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should parse an arg with specified optional ? value', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: '?', default: 'baz' }],
            '--foo bar',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should parse rest of args for * nargs', () => {
        const args = parseArgs(
            [{ name: 'foo', required: true, nargs: '*', default: [] }],
            '--foo bar baz',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse rest of args for * nargs with following arg', () => {
        const args = parseArgs(
            [
                { name: 'foo', required: true, nargs: '*', default: [] },
                { name: 'hello', required: true, nargs: 0 },
            ],
            '--foo bar baz --hello',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args).toHaveProperty('hello');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should throw for an arg with missing value', () => {
        expect(() =>
            parseArgs([{ name: 'foo', required: true, nargs: 1 }], '--foo'),
        ).toThrow('Not enough values supplied (arg: foo)');
    });

    it('Should throw duplicate parser args', () => {
        expect(() =>
            parseArgs(
                [
                    { name: 'foo', required: true, nargs: 0 },
                    { name: 'foo', required: true, nargs: 0 },
                ],
                '--foo',
            ),
        ).toThrow('Duplicate args specified to ArgParser (arg: foo)');
    });

    it('Should throw duplicate given args', () => {
        expect(() =>
            parseArgs(
                [{ name: 'foo', required: true, nargs: 0 }],
                '--foo --foo',
            ),
        ).toThrow('Duplicate args specified in command line (arg: --foo)');
    });
});
