import { ArgParser } from '../src/ArgParser';

describe('Arg Parser Tests', () => {
    it('Should parse with no args', () => {
        const parser = new ArgParser();
        expect(() => parser.parse()).not.toThrow();
    });

    it('Should ignore unspecified args', () => {
        type Schema = {
            flag: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'flag',
            required: false,
            nargs: 0,
        });

        const args = parser.parse(['--hello']);
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
        type Schema = {
            f: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'f', required: true, nargs: 0 });
        const args = parser.parse(['-f']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('f');
        expect(args.f).toBe(true);
    });

    it('Should parse a singular flag arg', () => {
        type Schema = {
            flag: boolean;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'flag', required: true, nargs: 0 });
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
        parser.addArgument({ name: 'flag', required: true, nargs: 0 });
        expect(() => parser.parse(['--hello --world'])).toThrow(
            'Missing required argument: flag',
        );
    });

    it('Should parse an arg with value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'foo',
            required: true,
            nargs: 1,
        });
        const args = parser.parse(['--foo', 'bar']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe('bar');
    });

    it('Should parse an arg with number value', () => {
        type Schema = {
            foo: number;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'foo', required: true, nargs: 1 });
        const args = parser.parse(['--foo', '69']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBe(69);
    });

    it('Should parse an arg with value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'foo', required: true, nargs: 2 });
        const args = parser.parse(['--foo', 'bar', 'baz']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toBeInstanceOf(Array);
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse an arg with not specified optional ? value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'foo',
            required: true,
            nargs: '?',
            default: 'bar',
        });
        const args = parser.parse(['--foo']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should parse an arg with specified optional ? value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'foo',
            required: true,
            nargs: '?',
            default: 'baz',
        });
        const args = parser.parse(['--foo', 'bar']);

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual('bar');
    });

    it('Should parse rest of args for * nargs', () => {
        type Schema = {
            foo: string[];
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'foo',
            required: true,
            nargs: '*',
            default: [],
        });
        const args = parser.parse('--foo bar baz'.split(' '));

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse rest of args for * nargs with following arg', () => {
        type Schema = {
            foo: string[];
            hello: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'foo',
            required: true,
            nargs: '*',
            default: [],
        });

        parser.addArgument({
            name: 'hello',
            required: true,
            nargs: 0,
        });

        const args = parser.parse('--foo bar baz --hello'.split(' '));

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args).toHaveProperty('hello');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should parse rest of args for * nargs with following arg', () => {
        type Schema = {
            foo: string[];
            hello: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({
            name: 'foo',
            required: true,
            nargs: '*',
            default: [],
        });

        parser.addArgument({
            name: 'hello',
            required: true,
            nargs: 0,
        });

        const args = parser.parse('--foo bar baz --hello'.split(' '));

        expect(args).toBeDefined();
        expect(args).toHaveProperty('foo');
        expect(args).toHaveProperty('hello');
        expect(args.foo).toStrictEqual(['bar', 'baz']);
    });

    it('Should throw for an arg with missing value', () => {
        type Schema = {
            foo: string;
        };
        const parser = new ArgParser<Schema>();
        parser.addArgument({ name: 'foo', required: true, nargs: 1 });
        expect(() => parser.parse(['--foo'])).toThrow(
            'Not enough values supplied (arg: foo)',
        );
    });
});
