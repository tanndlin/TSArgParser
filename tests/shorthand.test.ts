import { parseArgs } from './testutils';

describe('Shorthand Parsing Tests', () => {
    it('Should allow shorthand for non-ambiguous flag', () => {
        const args = parseArgs([{ name: 'flag', nargs: 'flag' }], '-f');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should disallow shorthand for ambiguous flag', () => {
        expect(() =>
            parseArgs(
                [
                    { name: 'flag', nargs: 'flag' },
                    { name: 'foo', nargs: 'flag' },
                ],
                '-f',
            ),
        ).toThrow(
            'Cannot use ambiguous shorthand -f (possible args: flag, foo)',
        );
    });

    it('Should disallow shorthand for unknown flag', () => {
        expect(() =>
            parseArgs([{ name: 'flag', nargs: 'flag' }], '-x'),
        ).toThrow('Unknown shorthand -x');
    });
});
