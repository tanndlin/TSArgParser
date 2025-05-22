export type BaseArgument<K extends string> = {
    name: K;
    describe?: string;
};

export type RequiredValueArgument<S> = {
    [P in keyof S]: {
        nargs: number;
        choices?: S[P][];
    } & BaseArgument<P & string>;
}[keyof S];

export type FlagArgument<S> = {
    nargs: 'flag';
} & BaseArgument<keyof S & string>;

export type AnyValueArgument<S> = {
    [P in keyof S]: {
        nargs: '*';
        default: S[P];
        choices?: S[P][];
    } & BaseArgument<P & string>;
}[keyof S];

export type OptionalValueArgument<S> = {
    [P in keyof S]: {
        nargs: '?';
        default: S[P];
        choices?: S[P][];
    } & BaseArgument<P & string>;
}[keyof S];

export type ValueArgument<S> =
    | OptionalValueArgument<S>
    | AnyValueArgument<S>
    | RequiredValueArgument<S>;

export type Argument<S> = ValueArgument<S> | FlagArgument<S>;
