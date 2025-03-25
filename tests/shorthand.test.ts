import { parseArgs } from './testutils';

describe('Shorthand Parsing Tests', () => {
    it('Should allow shorthand for non-ambiguous flag', () => {
        const args = parseArgs(
            [{ name: 'flag', required: false, nargs: 'flag' }],
            '-f',
        );
        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should disallow shorthand for ambiguous flag', () => {
        expect(() =>
            parseArgs(
                [
                    { name: 'flag', required: false, nargs: 'flag' },
                    { name: 'foo', required: false, nargs: 'flag' },
                ],
                '-f',
            ),
        ).toThrow(
            'Cannot use ambiguous shorthand -f (possible args: flag, foo)',
        );
    });
});
