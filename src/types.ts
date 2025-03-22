export type Argument = (RequiredArgument | OptionalArgument) & BaseArgument;

type RequiredArgument = {
    required: true;
};

type OptionalArgument = {
    required: false;
    default: any;
};

type BaseArgument = {
    aliases: string[];
    choices?: any[];
    nargs?: '?' | '*' | number;
};
