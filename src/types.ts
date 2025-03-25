export type Schema = Record<string, any>;

export type BaseArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = {
    name: K;
    choices?: S[K][];
};

export type RequiredValueArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = {
    nargs: number;
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
> = {
    nargs: '?' | '*';
    default: S[K];
} & BaseArgument<S, K>;

export type ValueArgument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = OptionalValueArgument<S, K> | RequiredValueArgument<S, K>;

export type Argument<
    S extends Schema,
    K extends Extract<keyof S, string> = Extract<keyof S, string>,
> = ValueArgument<S, K> | FlagArgument<S, K>;

export type NArgs = Argument<any, any>['nargs'];
