import {
    AmbigousArgumentError,
    DuplicateArgumentError,
    DuplicateCLIArgumentError,
    InvalidChoiceError,
    InvalidNameError,
    MissingArgumentError,
    NotEnoughValuesError,
    UnknownShorthandError,
    ZeroNargsError,
} from './Errors';
import {
    Argument,
    FlagArgument,
    OptionalValueArgument,
    RequiredValueArgument,
    Schema,
    ValueArgument,
} from './types';
import { isRequired, prependTacks, stringToBool } from './utils';

export class ArgParser<S extends Schema> {
    private arguments: Argument<S>[];
    private parsedArgs: S;

    constructor(args: Argument<S>[] = []) {
        this.arguments = [];
        args.forEach((arg) => this.addArgument(arg));

        this.parsedArgs = {} as S;
    }

    public parse(givenArgs: string[] = process.argv.slice(2)): S {
        this.replaceShorthands(givenArgs);
        this.checkDuplicateCLIArguments(givenArgs);

        this.arguments.forEach((arg) => {
            const found =
                arg.nargs === 'flag'
                    ? this.parseFlagArg(arg, givenArgs)
                    : this.parseWithArgs(arg, givenArgs);

            if (!found && isRequired(arg)) {
                throw new MissingArgumentError(arg.name);
            }
        });

        return this.parsedArgs;
    }

    private parseWithArgs(arg: ValueArgument<S>, givenArgs: string[]): boolean {
        switch (arg.nargs) {
            case '*':
                return this.parseAnyArgs(arg, givenArgs);
            case '?':
                return this.parseOptionalArg(arg, givenArgs);
            default:
                return this.parseNArgs(arg, givenArgs);
        }
    }

    private getCliFlagIndex(cliFlag: string, givenArgs: string[]): number {
        return givenArgs.findIndex((arg) => arg === cliFlag);
    }

    private getNextValues(
        index: number,
        givenArgs: string[],
        nargs: number,
    ): string[] {
        const values = [];
        for (let i = 1; i <= nargs; i++) {
            const value = givenArgs[index + i];
            if (!value || value.startsWith('-')) {
                break;
            }
            values.push(value);
        }
        return values;
    }

    private parseAnyArgs(
        arg: OptionalValueArgument<S>,
        givenArgs: string[],
    ): boolean {
        if (arg.nargs !== '*') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        const index = this.getCliFlagIndex(cliFlag, givenArgs);
        if (index === -1) {
            return false;
        }

        const values = this.getNextValues(index, givenArgs, Infinity);
        if (!values.length) {
            this.setParsedArg(arg, arg.default);
        } else {
            this.setParsedArg(arg, values as S[keyof S]);
        }

        return true;
    }

    private parseOptionalArg(
        arg: OptionalValueArgument<S>,
        givenArgs: string[],
    ): boolean {
        if (arg.nargs !== '?') {
            return false;
        }

        const cliFlag = prependTacks(arg.name);
        const index = this.getCliFlagIndex(cliFlag, givenArgs);
        if (index === -1) {
            this.setParsedArg(arg, arg.default);
            return true;
        }

        const [value] = this.getNextValues(index, givenArgs, 1);
        if (!value) {
            this.setParsedArg(arg, arg.default);
        } else {
            this.setParsedArg(arg, value as S[keyof S]);
        }
        return true;
    }

    private parseNArgs(
        arg: RequiredValueArgument<S>,
        givenArgs: string[],
    ): boolean {
        const cliFlag = prependTacks(arg.name);
        const index = this.getCliFlagIndex(cliFlag, givenArgs);
        if (index === -1) {
            return false;
        }

        const values = this.getNextValues(index, givenArgs, arg.nargs);
        if (values.length !== arg.nargs) {
            throw new NotEnoughValuesError(arg.name);
        }

        this.setParsedArg(
            arg,
            values.length > 1
                ? (values as S[keyof S])
                : (values[0] as S[keyof S]),
        );
        return true;
    }

    private parseFlagArg(arg: FlagArgument<S>, givenArgs: string[]) {
        const cliFlag = prependTacks(arg.name);
        this.parsedArgs[arg.name as keyof S] = givenArgs.includes(
            cliFlag,
        ) as S[keyof S];

        return true;
    }

    private validateChoices(arg: Argument<S>, value: any): void {
        if (!arg.choices) {
            return;
        }

        if (Array.isArray(value)) {
            value.forEach((val: any) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                if (!arg.choices!.includes(val)) {
                    throw new InvalidChoiceError(
                        arg.name,
                        arg.choices as string[],
                    );
                }
            });
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        } else if (!arg.choices.includes(value)) {
            throw new InvalidChoiceError(arg.name, arg.choices as string[]);
        }
    }

    private convertSingleValue(value: any, arg: Argument<S>): any {
        if (arg.nargs === 'flag') {
            return true;
        }

        // Try to infer type from default value if available
        const defaultType = typeof arg.choices?.[0];
        if (defaultType !== undefined) {
            if (defaultType === 'number') {
                return Number(value);
            } else if (defaultType === 'boolean') {
                return stringToBool(`${value}`);
            }
        }

        // Fallback to simple type detection
        if (value === 'true' || value === 'false') {
            return stringToBool(`${value}`);
        } else if (!isNaN(Number(value)) && value.toString().trim() !== '') {
            return Number(value);
        }

        // Default to string
        return value;
    }

    private convertType(arg: Argument<S>, value: any): S[keyof S] {
        const isArrayType =
            arg.nargs === '*' ||
            (typeof arg.nargs === 'number' && arg.nargs > 1);

        if (isArrayType && Array.isArray(value)) {
            return value.map((val) =>
                this.convertSingleValue(val, arg),
            ) as S[keyof S];
        }

        return this.convertSingleValue(value, arg) as S[keyof S];
    }

    private setParsedArg(arg: Argument<S>, value: S[keyof S]) {
        this.validateChoices(arg, value);
        const convertedValue = this.convertType(arg, value);
        this.parsedArgs[arg.name as keyof S] = convertedValue;
    }

    public addArgument(arg: Argument<S>) {
        if (arg.name.length === 0) {
            throw new InvalidNameError('At least one alias is required', arg);
        }

        if (!arg.name) {
            throw new InvalidNameError('Alias cannot be empty', arg);
        }

        if (arg.name.startsWith('-')) {
            throw new InvalidNameError(
                'Alias prefix tacks are implicitly added and thus should not contain them.',
                arg,
            );
        }

        if (arg.nargs === 0) {
            throw new ZeroNargsError(arg.name);
        }

        if (this.arguments.some((a) => a.name === arg.name)) {
            throw new DuplicateArgumentError(arg.name);
        }

        this.arguments.push(arg);
    }

    private replaceShorthands(givenArgs: string[]) {
        const flags = givenArgs
            .filter((arg) => /^-\w$/.test(arg))
            .map((arg) => arg.at(1)!);

        const matches = flags.map((flag) => {
            return {
                flag,
                matches: this.arguments.filter(
                    (arg) => arg.name.at(0) === flag,
                ),
            };
        });

        // Throw for ambiguous
        matches
            .filter((m) => m.matches.length > 1)
            .forEach((m) => {
                throw new AmbigousArgumentError(
                    m.matches.map((arg) => arg.name),
                );
            });

        // Throw for unknown
        matches
            .filter((m) => !m.matches.length)
            .forEach((m) => {
                throw new UnknownShorthandError(m.flag);
            });

        matches.forEach((matches) => {
            const { flag } = matches;
            const [match] = matches.matches;
            givenArgs
                .map((arg, index) => ({ arg, index }))
                .filter((arg) => arg.arg === prependTacks(flag))
                .forEach(
                    (arg) => (givenArgs[arg.index] = prependTacks(match.name)),
                );
        });
    }

    public checkDuplicateCLIArguments(givenArgs: string[]) {
        const args = givenArgs.filter((arg) => arg.startsWith('--'));
        const duplicates = args.filter((arg, index) => {
            return args.indexOf(arg) !== index;
        });

        if (duplicates.length) {
            throw new DuplicateCLIArgumentError(duplicates.join(', '));
        }
    }
}
