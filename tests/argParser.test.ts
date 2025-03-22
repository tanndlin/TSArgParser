import { ArgParser } from '../src/ArgParser';

describe('Arg Parser Tests', () => {
    it('Should parse with no args', () => {
        const parser = new ArgParser();
        expect(() => parser.parse()).not.toThrow();
    });

    it('Should disallow leading tacks', () => {
        const parser = new ArgParser();
        expect(() =>
            parser.addArgument({ aliases: ['--flag'], required: true }),
        ).toThrow(
            'Alias prefix tacks are implicitly added. Remove the prefix from --flag',
        );
    });

    it('Should parse a single char flag arg', () => {
        type Schema = {
            f: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['f'], required: true });
        const args = parser.parse(['-f']);

        console.log(args);
        expect(args).toBeDefined();
        expect(args).toHaveProperty('f');
        expect(args.f).toBe(true);
    });

    it('Should parse a singular flag arg', () => {
        type Schema = {
            flag: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['flag'], required: true });
        const args = parser.parse(['--flag']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('flag');
        expect(args.flag).toBe(true);
    });

    it('Should throw for missing required arg', () => {
        type Schema = {
            flag: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['flag'], required: true });
        expect(() => parser.parse(['--hello --world'])).toThrow(
            'Missing required argument: flag',
        );
    });

    it('Should parse an arg with value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['foo'], required: true, nargs: 1 });
        const args = parser.parse(['--foo', 'bar']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBeInstanceOf(String);
        expect(args.foo).toBe('bar');
    });

    it('Should parse an arg with value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['foo'], required: true, nargs: 2 });
        const args = parser.parse(['--foo', 'bar', 'baz']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBeInstanceOf(Array);
        expect(args.foo).toBe(['bar', 'baz']);
    });

    it('Should throw for an arg with missing value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['foo'], required: true, nargs: 1 });
        expect(() => parser.parse(['--foo'])).toThrow(
            'Missing required argument: foo',
        );
    });
});
