# TSArgParser

A powerful, type-safe, and flexible argument parser for TypeScript/JavaScript. Supports flags, required/optional/multiple arguments, type inference, choices, shorthands, and more. Inspired by Python's argparse, but designed for modern TypeScript projects.

## Features

- **Type-safe argument definitions**
- **Flags, required, optional, and variadic arguments**
- **Automatic type inference (number, boolean, string)**
- **Choices (enum-like constraints)**
- **Default values**
- **Shorthand flags (e.g., `-f` for `--flag`)**
- **Ambiguity and error detection**
- **Duplicate argument detection**
- **Process `process.argv` or custom arg arrays**

## No Dependencies

This library is lightweight and has no external dependencies, making it easy to integrate into any TypeScript or JavaScript project.

## Basic Usage

```ts
import { ArgParser } from 'tsconfigparser';

const parser = new ArgParser([
  { name: 'input', nargs: 1 },
  { name: 'verbose', nargs: 'flag' },
]);

const args = parser.parse(['--input', 'file.txt', '--verbose']);
console.log(args.input);   // 'file.txt'
console.log(args.verbose); // true
```

## Argument Types

- **Flag**: `{ name: 'flag', nargs: 'flag' }` → `--flag` or `-f`
- **Required value**: `{ name: 'foo', nargs: 1 }` → `--foo value`
- **Optional value**: `{ name: 'bar', nargs: '?', default: 'baz' }` → `--bar [value]`
- **Multiple values**: `{ name: 'files', nargs: '*', default: [] }` → `--files a.txt b.txt`
- **Fixed number of values**: `{ name: 'coords', nargs: 2 }` → `--coords 10 20`

## Examples

### Flags

```ts
const parser = new ArgParser([{ name: 'debug', nargs: 'flag' }]);
const args = parser.parse(['--debug']);
console.log(args.debug); // true
```

### Required and Optional Arguments

```ts
const parser = new ArgParser([
  { name: 'input', nargs: 1 },
  { name: 'output', nargs: '?', default: 'out.txt' },
]);
const args = parser.parse(['--input', 'file.txt']);
console.log(args.output); // 'out.txt' (default)
```

### Multiple Values (Variadic)

```ts
const parser = new ArgParser([
  { name: 'numbers', nargs: '*', default: [] },
]);
const args = parser.parse(['--numbers', '1', '2', '3']);
console.log(args.numbers); // [1, 2, 3]
```

### Choices (Enum-like)

```ts
const parser = new ArgParser([
  { name: 'mode', nargs: 1, choices: ['dev', 'prod', 'test'] },
]);
const args = parser.parse(['--mode', 'dev']);
// Throws if not one of the choices
```

### Shorthand Flags

```ts
const parser = new ArgParser([
  { name: 'force', nargs: 'flag' },
]);
const args = parser.parse(['-f']); // -f is shorthand for --force
console.log(args.force); // true
```

### Type Inference

```ts
const parser = new ArgParser([
  { name: 'count', nargs: 1 },
  { name: 'enabled', nargs: 'flag' },
]);
const args = parser.parse(['--count', '42', '--enabled']);
console.log(keyof args); // 'count' | 'enabled'
```

### Error Handling

- Duplicate arguments: throws error
- Unknown/ambiguous shorthands: throws error
- Missing required arguments: throws error
- Invalid choices: throws error

## API

### `new ArgParser<S>(args: Argument<S>[]).parse(cliArgs: string[]): S`

- `args`: Array of argument definitions (see above)
- `cliArgs`: Array of command-line arguments (e.g., `process.argv.slice(2)`)
- Returns an object with parsed values

### `parseArgs<S>(args: Argument<S>[], cliArgs: string): S`

- `args`: Array of argument definitions (see above)
- Parses the given argument array (defaults to `process.argv.slice(2)`)
- Returns an object with parsed values

## Advanced Example

```ts
const parser = new ArgParser([
  { name: 'input', nargs: 1 },
  { name: 'output', nargs: '?', default: 'out.txt' },
  { name: 'mode', nargs: 1, choices: ['dev', 'prod', 'test'] },
  { name: 'verbose', nargs: 'flag' },
  { name: 'numbers', nargs: '*', default: [] },
]);

const args = parser.parse('--input foo.txt --mode dev --verbose --numbers 1 2 3'.split(' '));
console.log(args);
// {
//   input: 'foo.txt',
//   output: 'out.txt',
//   mode: 'dev',
//   verbose: true,
//   numbers: [1, 2, 3]
// }
```
