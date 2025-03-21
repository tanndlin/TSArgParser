export type ArgumentOptions = {
    aliases: string[];
    nargs?: NArgs;
    required?: boolean;
};

type NArgs = '?' | '*' | number;
