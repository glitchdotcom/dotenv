# @glitchdotcom/dotenv

`@glitchdotcom/dotenv` is a totally tubular 🏄🏼 library to parse _and manipulate_ dotenv
syntax while maintaining comments and whitespace. `@glitchdotcom/dotenv` has zero
dependencies, is licensed under the MIT license, and has a simple, functional api.

## install

```bash
# npm
npm install @glitchdotcom/dotenv

# yarn
yarn add @glitchdotcom/dotenv

# pnpm
pnpm install @glitchdotcom/dotenv
```

## license, code of conduct, and contributing

`@glitchdotcom/dotenv` is licensed under the MIT license. a copy of this license can be
found in the [LICENSE](LICENSE) file.

for this project's code of conduct, see the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) file.

do you want to contribute to something \~amazing\~ (this package)? yes?? well the [CONTRIBUTING.md](CONTRIBUTING.md)
file should tell you everything you need to know! if it doesn't, let us know (which would
make a _perfect_ first contribution)!

## quickstart

```javascript
import * as dotenv from "@glitchdotcom/dotenv";
// or... const dotenv = require("@glitchdotcom/dotenv");

const envText = `SOME_KEY=some value`;

// node list represents the following as an array of objects...
// SOME_KEY=some value
let nodes = dotenv.textToNodes(envText);

// find index of the key value node with SOME_KEY as the key
const index = nodes.find((node) => node.key === "SOME_KEY");

// nodes now represents...
// ANOTHER_KEY=some value
nodes = dotenv.changeKey(nodes, index, "ANOTHER_KEY");

// nodes now represents...
// ANOTHER_KEY=another value
nodes = dotenv.changeValue(nodes, index, "another value");

// nodes now represents...
// ANOTHER_KEY=another value
// NEW_KEY=new value
nodes = dotenv.appendKeyValue(nodes, "NEW_KEY", "new value");

// nodes now represents...
// NEW_KEY=new value
nodes = dotenv.removeKeyValue(nodes, index);

// newText will be "NEW_KEY=new value"
const newText = dotenv.nodesToText(nodes);

// parsedText will be { NEW_KEY: "new value" }
const parsedText = dotenv.parseText(newText);

// parsedNodes will be { NEW_KEY: "new value" }
const parsedNodes = dotenv.parseNodes(nodes);
```

## api

### node types

dotenv exports a handful of consts that represent the different types of nodes. there are
3 node types, `KEY_VALUE`, `COMMENT`, and `INVALID_LINE`.

example:

```javascript
import * as dotenv from "@glitchdotcom/dotenv";

let nodes = dotenv.textToNodes(`KEY=value
# some comment`);

let firstCommentNode = nodes.find((node) => node.type === dotenv.COMMENT);

if (!firstCommentNode) {
	// no comment node found!
} else {
	assert(firstCommentNode.comment === "some comment");
}
```

### node objects and properties

`KEY_VALUE` nodes have the following properties: type (will always be `"KEY_VALUE"`), key (no
whitespace), value (no whitespace), escapedValue (value including escaped newlines),
fullKey (includes extraneous whitespace), fullValue (includes extraneous whitespace), quote (",
', or an empty string depending on what quotes are around the value), and originalQuote (the
quotes that were around the value when the text was parsed). as an example, a key-value pair
like this...

```bash
# extra whitespace intentional
  SOME_KEY= some value
```

...will be parsed into a node like this...

```javascript
{
	type: "KEY_VALUE",
	key: "SOME_KEY",
	fullKey: "  SOME_KEY",
	value: "some value",
	escapedValue: "some value",
	fullValue: " some value",
	quote: "",
	originalQuote: ""
}
```

if the value contained escaped newlines and quotes around it like this...

```bash
# extra whitespace intentional
  SOME_KEY=" some \n value"
```

...then it will be parsed into something like this...

```javascript
{
	type: "KEY_VALUE",
	key: "SOME_KEY",
	fullKey: "  SOME_KEY",
	value: " some \n value", // notice the extra space in front
	escapedValue: " some \\n value",
	fullValue: " some \\n value",
	quote: '"', // quote and originalQuote contain the quote that was used
	originalQuote: '"'
}
```

`COMMENT` nodes have the following properties: type (will always be `"COMMENT"`), prefix (pound
symbol and extraneous whitespace before comment body), and comment (the comment body). as an
example, a comment line like this...

```bash
  # a comment! leading whitespace intentional
```

...will be parsed into a node like this...

```javascript
{
	type: "COMMENT",
	prefix: "  # ", // note the whitespace in the prefix
	comment: "a comment! leading whitespace intentional"
}
```

`INVALID_LINE` nodes have the following properties: type (will always be `INVALID_LINE`), and
line (the contents of the line). as an example, an invalid line like this...

```bash
i am an invalid line because i do not contain an equals sign!
```

...will be parsed into a node like this...

```javascript
{
	type: "INVALID_LINE",
	line: "i am an invalid line because i do not contain an equals sign!"
}
```

### textToNodes/nodesToText

`textToNodes` converts text to a dotenv node list that can be manipulated. the node list
represents the data contained within the string passed to `textToNodes` as an array of nodes.
it also maintains comments, empty/invalid lines, and extraneous whitespace. it does
everything it can to return _something_ even if the string passed to it is not valid dotenv
syntax. `nodesToText` does the reverse of `textToNodes`. it takes a node list and converts it
back into a string. like `textToNodes`, it maintains comments, empty/invalid lines, and
extraneous whitespace.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let nodes = dotenv.textToNodes(`KEY=value`);
let text = dotenv.nodesToText(nodes);
assert(text === `KEY=value`);
```

### appendKeyValue

adds a new key value pair to the end of the node list. like all dotenv manipulation
functions, `appendKeyValue` is immutable and returns a new list instead of modifying the
list in place.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let nodes = dotenv.textToNodes(`KEY=value`);
nodes = dotenv.appendKeyValue(nodes, "SOMETHING", "anything");
let text = dotenv.nodesToText(nodes);
assert(
	text ===
		`KEY=value
SOMETHING=anything`,
);
```

### changeKey

`changeKey` changes the key of a key-value node. like all dotenv manipulation
functions, `changeKey` is immutable and returns a new list instead of modifying the
list in place.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let nodes = dotenv.textToNodes(`KEY=value`);
let index = nodes.find((node) => node.key === "KEY");
nodes = dotenv.changeKey(nodes, index, "SOMETHING_ELSE");
let text = dotenv.nodesToText(nodes);
assert(text === `SOMETHING_ELSE=value`);
```

### changeValue

`changeValue` changes the value of a key-value node. like all dotenv manipulation
functions, `changeValue` is immutable and returns a new list instead of modifying the
list in place.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let nodes = dotenv.textToNodes(`KEY=value`);
let index = nodes.find((node) => node.key === "KEY");
nodes = dotenv.changeValue(nodes, index, "another value");
let text = dotenv.nodesToText(nodes);
assert(text === `KEY=another value`);
```

### removeKeyValue

`removeKeyValue` removes a key-value node from the node list. like all dotenv manipulation
functions, `removeKeyValue` is immutable and returns a new list instead of modifying the
list in place.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let nodes = dotenv.textToNodes(`KEY=value
SOMETHING=anything`);
let index = nodes.find((node) => node.key === "SOMETHING");
nodes = dotenv.removeKeyValue(nodes, index);
let text = dotenv.nodesToText(nodes);
assert(text === `KEY=value`);
```

### parseText

`parseText` takes dotenv text and extracts the key-value pairs into an object.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let env = dotenv.parseText(`KEY=value`);
assert(env.KEY === `value`);
```

### parseNodes

`parseNodes` takes a node list and extracts the key-value pairs into an object. generally
you want to use `parseText`, however if you've already converted the text into a node list,
`parseNodes` skips the text parsing step.

example:

```javascript
import dotenv from "@glitchdotcom/dotenv";
let nodes = dotenv.textToNodes(`KEY=value`);
let env = dotenv.parseNodes(nodes);
assert(env.KEY === `value`);
```

## Made by [Glitch](https://glitch.com/)

<!-- prettier-ignore -->
\ ゜o゜)ノ
