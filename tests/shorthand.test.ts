import { parseArgs } from './testutils';

describe('Shorthand Parsing Tests', () => {
    it('Should allow shorthand for non-ambiguous flag', () => {
        const args = parseArgs<{
            flag: boolean;
        }>([{ name: 'flag', required: true, nargs: 0, type: 'boolean' }], '-f');
        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should disallow shorthand for ambiguous flag', () => {
        expect(() =>
            parseArgs<{
                flag: boolean;
                foo: boolean;
            }>(
                [
                    { name: 'flag', required: true, nargs: 0, type: 'boolean' },
                    { name: 'foo', required: true, nargs: 0, type: 'boolean' },
                ],
                '-f',
            ),
        ).toThrow(
            'Cannot use ambiguous shorthand -f (possible args: flag, foo)',
        );
    });
});
