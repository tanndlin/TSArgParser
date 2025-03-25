export type SimpleType = string | number | boolean;
export type Schema = Record<string, SimpleType | SimpleType[]>;

export type BaseArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = {
    name: K;
};

export type RequiredValueArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
    V = S[K],
> = {
    nargs: number;
    choices?: V[];
} & BaseArgument<S, K>;

export type FlagArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = {
    nargs: 'flag';
} & BaseArgument<S, K>;

export type OptionalValueArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
    V = S[K],
> = {
    nargs: '?' | '*';
    default: S[K];
    choices?: V[];
} & BaseArgument<S, K>;

export type ValueArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = OptionalValueArgument<S, K> | RequiredValueArgument<S, K>;

export type Argument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = ValueArgument<S, K> | FlagArgument<S, K>;
