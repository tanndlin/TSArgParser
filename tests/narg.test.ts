import { parseArgs } from './testutils';

describe('Narg Tests', () => {
    it('Should parse an arg with not specified optional ? value', () => {
        const args = parseArgs(
            [
                {
                    name: 'foo',
                    nargs: '?',
                    default: 'bar',
                },
            ],
            '--foo',
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
                    nargs: '*',
                    default: [],
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
                    nargs: '*',
                    default: [],
                },
                {
                    name: 'hello',
                    nargs: 'flag',
                },
            ],
            '--foo bar baz --hello',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args).toHaveProperty('hello');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should handle empty values for nargs=* when no values provided', () => {
        const args = parseArgs(
            [
                {
                    name: 'files',
                    nargs: '*',
                    default: [],
                },
            ],
            '--files',
        );
        expect(args.files).toEqual([]);
    });

    it('Should use default value when nargs=* has no values', () => {
        const args = parseArgs(
            [
                {
                    name: 'files',
                    nargs: '*',
                    default: ['default.txt'],
                },
            ],
            '--files',
        );
        expect(args.files).toEqual(['default.txt']);
    });

    it('Should properly convert all numeric values for nargs=*', () => {
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
        expect(args.numbers).toEqual([1, 2, 3]);
        expect(typeof args.numbers[0]).toBe('number');
    });

    it('Should disallow nargs=0', () => {
        expect(() =>
            parseArgs(
                [
                    {
                        name: 'foo',
                        nargs: 0,
                    },
                ],
                '--foo',
            ),
        ).toThrow(
            "nargs=0 is not allowed Did you mean nargs='flag'? (arg: foo)",
        );
    });
});
