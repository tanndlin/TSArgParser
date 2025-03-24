export type Schema = Record<string, any>;

type BaseArgument<T> = {
    name: Extract<keyof T, string>;
    type: 'string' | 'number' | 'boolean';
    nargs: '?' | '*' | number;
    required: boolean;
    choices?: T[keyof T][];
};

type RequiredValueArgument = {
    nargs: number;
    required: true;
};

type FlagArgument = {
    nargs: 0;
    type: 'boolean';
    default: false;
    required: boolean;
};

type OptionalValueArgument<T> =
    | {
          required: false;
          default: T[Extract<keyof T, string>];
      }
    | {
          nargs: '?' | '*';
          default: T[Extract<keyof T, string>];
      }
    | FlagArgument;

type ValueArgument<T> = OptionalValueArgument<T> | RequiredValueArgument;

export type Argument<T> = ValueArgument<T> & BaseArgument<T>;

export type NArgs = Argument<null>['nargs'];
