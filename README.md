# Bitburner - Scripts

This is a repo for all my scripts I use for the game [Bitburner](https://bitburner-official.github.io/).
These scripts will most likely be in a constant state of chaos and uncertainty. Use at your own risk and remember
to backup your saves before use.

## About

[Bitburner](https://bitburner-official.github.io/) is an idle programming game about "hacking" into virtual machines and stealing money. This is
by no means realistic, but it is extremely fun and a great way to learn javascript/typescript. The game rewards you for even
hacking the game itself.

See also:
- [Bitburner NS API](https://github.com/bitburner-official/bitburner-src/blob/dev/markdown/bitburner.ns.md)

## Prerequisites

[Node.js](https://nodejs.org/en/download/) is needed for compiling typescript and installing dependencies.

## Quick start

Download this repo and launch the watcher:
```
git clone https://github.com/rdcuzins/bitburner
cd bitburner
npm i
npm run watch
```

Make sure to start the API server inside the game so node can push changes after `npm run watch`.
You can edit/view the port by changing filesync.json in the root of this repository.

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
