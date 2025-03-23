import { ArgParser } from '../src/ArgParser';

describe('Shorthand Parsing Tests', () => {
    it('Should allow shorthand for non-ambiguous flag', () => {
        type Schema = {
            flag: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'flag', required: true, nargs: 0 });
        const args = parser.parse(['-f']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should disallow shorthand for ambiguous flag', () => {
        type Schema = {
            flag: boolean;
            foo: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'flag', required: true, nargs: 0 });
        parser.addArgument({ name: 'foo', required: true, nargs: 0 });
        expect(() => parser.parse(['-f'])).toThrow(
            'Cannot use ambiguous shorthand -f (possible args: flag, foo)',
        );
    });
});
