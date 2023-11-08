# Bitburner Scripts
This is a collection of scripts I tinker with in the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/).
Bitburner is an incremintal game about hacking computers. Using javascript/typescript you can fully automate the game and solve
its puzzles to progress and level up.

> [!WARNING]
> Some scripts may contain spoilers (such as the UI and how I interact with the Document element). Also some scripts may be broken.

## Prerequisites

[Node.js](https://nodejs.org/en/download/) is needed for compiling typescript and installing dependencies.

[See here for step by step installation](BeginnersGuide.md) if you'd like help with installing Node and/or connecting to the game.

Alternatively see [Docker install guide](DockerGuide.md) (optional) that installs nodejs and the Remote File API in an isolated container.

### How to use this repo
Write all your typescript source code in the `/src` directory

To autocompile and send changed files as you save, run `npm run watch` in a terminal.
Have it running in the background so that it all happens automatically.

For Bitburner to receive any files, you need to enter the port `npm run watch` logs to the terminal
in the Remote API section of the game settings, and press the connect button.

[See here for step by step installation](BeginnersGuide.md) if you'd like help with installing Node and/or connecting to the game.

Alternatively see [Docker install guide](DockerGuide.md) (optional) that installs nodejs and the Remote File API in an isolated container.

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

### Debugging

For debugging bitburner on Steam you will need to enable a remote debugging port. This can be done by rightclicking bitburner in your Steam library and selecting properties. There you need to add `--remote-debugging-port=9222` [Thanks @DarkMio]

### Using React
Some `ns` functions, like [`ns.printRaw()`](https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.ns.printraw.md) allows you to render React components into the game interface. 

The game already exposes the `React` and `ReactDOM` objects globally, but in order to work with strongly typed versions in `.ts` files, you can use the included typings. To do this, use the following import:

`import React, { ReactDOM } from '@react'`

Support for jsx is also included, so if you use the `.tsx` file ending, you can do something like:

```ts
import { NS } from '@ns';
import React from '@react';

interface IMyContentProps {
  name: string
}

const MyContent = ({name}: IMyContentProps) => <span>Hello {name}</span>;

export default async function main(ns: NS){
  ns.printRaw(<MyContent name="Your name"></MyContent>);
}
```



https://darktechnomancer.github.io/#thread-functions