export type Schema = Record<string, any>;

export type BaseArgument<S extends Schema, K extends keyof S> = {
    name: K;
    required: boolean;
    choices?: S[K][];
    default?: S[K];
};

type RequiredValueArgument = {
    nargs: number;
    required: true;
};

export type FlagArgument<S extends Schema, K extends keyof S> = {
    nargs: 'flag';
    required: false;
} & BaseArgument<S, K>;

type OptionalValueArgument<S extends Schema, K extends keyof S> =
    | {
          required: false;
          nargs: number;
          default: S[K];
      }
    | {
          nargs: '?' | '*';
          default: S[K];
      };

type ValueArgument<S extends Schema, K extends keyof S> = (
    | OptionalValueArgument<S, K>
    | RequiredValueArgument
) &
    BaseArgument<S, K>;

export type Argument<S extends Schema, K extends keyof S> =
    | ValueArgument<S, K>
    | FlagArgument<S, K>;

export type NArgs = Argument<any, any>['nargs'];
