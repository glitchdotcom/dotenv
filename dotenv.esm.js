// Node types
export const EMPTY_LINE = "EMPTY_LINE";
export const KEY_VALUE = "KEY_VALUE";
export const COMMENT = "COMMENT";
export const INVALID_LINE = "INVALID_LINE";

function splitAtFirst(string, delimiter) {
	const [first, ...rest] = string.split(delimiter);
	return [first, rest.length > 0 ? rest.join(delimiter) : null];
}

// parse a single line into a node
function parseLine(line) {
	// First handle empty lines...
	if (line.trim() === "") {
		return { type: EMPTY_LINE };
	}

	// ...then handle comments...
	const [firstNonWhitespaceChar] = line.match(/\S/) || [];
	if (firstNonWhitespaceChar === "#") {
		const [_fullMatch, prefix, comment] = line.match(/(^\s*#\s*)(.*)/);
		return { type: COMMENT, prefix, comment };
	}

	// ...now try to parse as a KV pair
	const [fullKey, fullValue] = splitAtFirst(line, "=");

	// if there is no `=` in the line, it's an invalid line
	if (fullValue === null) {
		return { type: INVALID_LINE, text: line };
	}

	const key = fullKey.trim();

	// if the key contains whitespace, it's an invalid line
	if (key.match(/\s/)) {
		return { type: INVALID_LINE, text: line };
	}

	// extract whitespace before and after value
	const [valuePrefix] = fullValue.match(/^\s+/) || [""];
	const [valueSuffix] = fullValue.match(/\s+$/) || [""];

	let value = fullValue.trim();

	// find and remove quotes if the value is quoted
	let quote = "";
	const [startQuote] = value.match(/^("|')/) || [];
	if (startQuote && value.endsWith(startQuote)) {
		value = value.slice(1, -1);
		quote = startQuote;
	}

	// if double quoted, unescape newlines
	if (quote === '"') {
		value = value.replace(/\\n/g, "\n");
	}

	return {
		type: KEY_VALUE,
		key,
		value,
		fullKey,
		fullValue,
		valuePrefix,
		valueSuffix,
		quote,
		originalQuote: quote,
	};
}

// split at newlines, parse each line, push results into node list
export function textToAst(text) {
	const lines = text.split("\n");
	const result = [];

	for (const line of lines) {
		result.push(parseLine(line));
	}

	return result;
}

// build a string from a node list
export function astToText(ast) {
	let result = "";

	for (const node of ast) {
		if (node.type === KEY_VALUE) {
			result += `${node.fullKey}=${node.fullValue}`;
		} else if (node.type === COMMENT) {
			result += `${node.prefix}${node.comment}`;
		} else if (node.type === INVALID_LINE) {
			result += node.text;
		} else if (node.type === EMPTY_LINE) {
			// pass, we add a newline after this `else if` chain
		} else {
			// if someone manually manipulated the node list, we could have an invalid node
			throw new Error(`Invalid node type: ${node.type}`);
		}

		result += "\n";
	}

	// remove extra newline at the end
	return result.slice(0, -1);
}

// find ast node, ensure it's a kv pair, and immutably update its `key` and `fullKey` properties
export function changeKey(ast, index, newKey) {
	const node = ast[index];
	if (node.type !== KEY_VALUE) {
		return ast;
	}

	const key = newKey.trim();
	const newNode = {
		...node,
		key: key,
		fullKey: node.fullKey.replace(node.key, key),
	};

	const newAst = ast.slice(); // clone array since .splice mutates
	newAst.splice(index, 1, newNode); // replace element at index with newNode
	return newAst;
}

// find ast node, ensure it's a kv pair, and immutably update its `value`, `fullValue`, and `quote` properties
export function changeValue(ast, index, newValue) {
	const node = ast[index];
	if (node.type !== KEY_VALUE) {
		return ast;
	}

	// if the new value needs to be escaped (contains a newline or has leading or trailing whitespace), change quote
	// to double quotes, otherwise keep whatever the original node had. if a value later doesn't need to be quoted,
	// it will swap back to the quotes used in the original text
	const quote =
		newValue.match(/\n/) || newValue.match(/^\s/) || newValue.match(/\s$/)
			? '"'
			: node.originalQuote;

	// build a full value containing leading whitespace, a quote (if needed), the new value (escaped), an end
	// quote (if needed), and then the trailing whitespace
	const fullValue = `${node.valuePrefix}${quote}${newValue.replace(
		/\n/g,
		"\\n",
	)}${quote}${node.valueSuffix}`;

	const newNode = {
		...node,
		value: newValue,
		fullValue,
		quote,
	};

	const newAst = ast.slice(); // clone array since .splice mutates
	newAst.splice(index, 1, newNode); // replace element at index with newNode
	return newAst;
}

// append a key value pair to the end of the node list
export function appendKeyValue(ast, key, value) {
	if (key.match(/\s/)) {
		throw new Error("Keys cannot contain whitespace");
	}

	const newNode = {
		type: KEY_VALUE,
		key,
		fullKey: key,
		value,
		fullValue: value.replace("\n", "\\n"),
		valuePrefix: "",
		valueSuffix: "",
		quote: value.includes("\n") ? '"' : null,
	};

	return [...ast, newNode];
}

// remove a key value pair from the node list at index
export function removeKeyValue(ast, index) {
	const node = ast[index];
	if (node.type !== KEY_VALUE) {
		return ast;
	}

	const newAst = ast.slice(); // clone array since .splice mutates
	newAst.splice(index, 1); // replace element at index with newNode
	return newAst;
}

// extract key value pairs from a node list into a Javascript object
export function parseAst(ast) {
	const result = {};
	for (const node of ast) {
		if (node.type === KEY_VALUE) {
			result[node.key] = node.value;
		}
	}
	return result;
}

// leverage textToAst and parseAst to extract key value pairs from a dotenv string into a Javascript object
export function parseText(text) {
	const ast = textToAst(text);
	return parseAst(ast);
}
