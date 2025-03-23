type BaseArgument = {
    aliases: string[];
    required: boolean;
    choices?: any[];
};

type OptionalValueArgument =
    | {
          nargs: '?';
          default: any;
      }
    | {
          nargs: '*';
          default: any[];
      };

export type RequiredValueArgument = {
    nargs: number;
};

type FlagArgument = {
    nargs: 0;
};

export type Argument = (
    | OptionalValueArgument
    | RequiredValueArgument
    | FlagArgument
) &
    BaseArgument;
