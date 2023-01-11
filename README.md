# Typescript template for Bitburner's Remote File API

Built from the official template for synchronizing Typescript/Javascript from your computer to the game.

[Step by step install](BeginnersGuide.md)

[Learn more about Typescript](https://www.typescriptlang.org/docs/)

## About

This is based on the template that uses the Typescript compiler and the Remote File API system to synchronize Typescript to [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).

## Prerequisites

[Node.js](https://nodejs.org/en/download/) is needed for compiling typescript and installing dependencies

[See here for step by step installation](BeginnersGuide.md) if you'd like help with installing Node and/or connecting to the game.

### How to use this setup

Write all your typescript source code in the `/src` directory

To autocompile and send changed files as you save, run `npm run watch` in a terminal.
Have it running in the background so that it all happens automatically.

For Bitburner to receive any files, you need to enter the port `npm run watch` logs to the terminal
in the Remote API section of the game settings, and press the connect button.

[See here for step by step installation](BeginnersGuide.md) if you'd like help with installing Node and/or connecting to the game.

## Advanced
### Imports

To ensure both the game and typescript have no issues with import paths, your import statements should follow a few formatting rules:

- Paths must be absolute from the root of `src/`, which will be equivalent to the root directory of your home drive
- Paths must contain no leading slash
- Paths must end with no file extension

#### Examples:

To import `helperFunction` from the file `helpers.ts` located in the directory `src/lib/`:

```js
import { helperFunction } from "lib/helpers";
```

To import all functions from the file `helpers.ts` located in the `src/lib/` directory as the namespace `helpers`:

```js
import * as helpers from "lib/helpers";
```

To import `someFunction` from the file `main.ts` located in the `src/` directory:

```js
import { someFunction } from "main";
```

## Documentation

Official documentation for the game can be found [here](https://bitburner.readthedocs.io/en/latest/).

## Scripts 

This repo is uses *often* broken and inefficient scripts. The scripts will be constantly changed and updated so long as Bitburner keeps my attention. Use at your own risk. 