export type BaseArgument<S> = {
    name: keyof S & string;
    describe?: string;
};

export type RequiredValueArgument<S, V = S[keyof S & string]> = {
    nargs: number;
    choices?: V[];
} & BaseArgument<S>;

export type FlagArgument<S> = {
    nargs: 'flag';
} & BaseArgument<S>;

export type AnyValueArgument<S> = {
    nargs: '*';
    default: S[keyof S & string];
    choices?: S[keyof S][];
} & BaseArgument<S>;

export type OptionalValueArgument<S> = {
    nargs: '?';
    default: S[keyof S];
    choices?: S[keyof S][];
} & BaseArgument<S>;

export type ValueArgument<S> =
    | OptionalValueArgument<S>
    | AnyValueArgument<S>
    | RequiredValueArgument<S>;

export type Argument<S> = ValueArgument<S> | FlagArgument<S>;
