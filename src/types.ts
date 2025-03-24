export type Schema = Record<string, any>;

type BaseArgument<T> = {
    name: Extract<keyof T, string>;
    required: boolean;
    type: 'string' | 'number' | 'boolean';
    choices?: T[keyof T][];
};

type OptionalValueArgument<T> = (
    | {
          nargs: '?';
      }
    | {
          nargs: '*';
      }
) & { default: T[Extract<keyof T, string>] };

export type RequiredValueArgument = {
    nargs: number;
};

type FlagArgument = {
    nargs: 0;
    type: 'boolean';
    default: false;
};

export type Argument<T> = (
    | OptionalValueArgument<T>
    | RequiredValueArgument
    | FlagArgument
) &
    BaseArgument<T>;

export type NArgs = Argument<null>['nargs'];
