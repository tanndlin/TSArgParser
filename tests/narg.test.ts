import { parseArgs } from './testutils';

describe('Narg Tests', () => {
    it('Should parse an arg with not specified optional ? value', () => {
        const args = parseArgs(
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

    it('Should handle empty values for nargs=* when no values provided', () => {
        const args = parseArgs(
            [
                {
                    name: 'files',
                    required: true,
                    nargs: '*',
                    type: 'string',
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
                    required: true,
                    nargs: '*',
                    type: 'string',
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
                    required: true,
                    nargs: '*',
                    type: 'number',
                    default: [],
                },
            ],
            '--numbers 1 2 3',
        );
        expect(args.numbers).toEqual([1, 2, 3]);
        expect(typeof args.numbers[0]).toBe('number');
    });
});
