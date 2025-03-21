import { ArgParser } from '../src/ArgParser';

describe('Arg Parser Tests', () => {
    it('Should parse with no args', () => {
        const parser = new ArgParser<null>();
        expect(() => parser.parse()).not.toThrow();
    });

    it('Should disallow leading tacks', () => {
        const parser = new ArgParser<null>();
        expect(() => parser.addArgument({ aliases: ['--flag'] })).toThrow(
            'Alias prefix tacks are implicitly added. Remove the prefix from --flag',
        );
    });

    it('Should parse a single char flag arg', () => {
        type Schema = {
            f: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ aliases: ['f'] });
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
        parser.addArgument({ aliases: ['flag'] });
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
});
