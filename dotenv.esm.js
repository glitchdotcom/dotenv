// node types
export const KEY_VALUE = "KEY_VALUE";
export const COMMENT = "COMMENT";
export const INVALID_LINE = "INVALID_LINE";

function splitAtFirst(string, delimiter) {
	const [first, ...rest] = string.split(delimiter);
	return [first, rest.length > 0 ? rest.join(delimiter) : null];
}

function escape(string) {
	return string.replace(/\n/g, "\\n");
}

function unescape(string) {
	return string.replace(/\\n/g, "\n");
}

// parse a single line into a node
function parseLine(line) {
	// handle comments...
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

	// if the key contains whitespace or is empty, it's an invalid line
	if (key.match(/\s/) || key === "") {
		return { type: INVALID_LINE, text: line };
	}

	let escapedValue = fullValue.trim();

	// find and remove quotes if the value is quoted
	let quote = "";
	const [startQuote] = escapedValue.match(/^("|')/) || [];
	if (startQuote && escapedValue.endsWith(startQuote)) {
		escapedValue = escapedValue.slice(1, -1);
		quote = startQuote;
	}

	// if double quoted, unescape newlines
	let value = escapedValue;
	if (quote === '"') {
		value = unescape(value);
	}

	return {
		type: KEY_VALUE,
		key,
		fullKey,
		value,
		escapedValue,
		fullValue,
		quote,
		originalQuote: quote,
	};
}

// split at newlines, parse each line, push results into node list
export function textToNodes(text) {
	if (text === "") {
		return [];
	}

	const lines = text.split("\n");
	const result = [];

	for (const line of lines) {
		result.push(parseLine(line));
	}

	return result;
}

// maintain reference after name change
export const textToAst = textToNodes;

// build a string from a node list
export function nodesToText(nodes) {
	let result = "";

	for (const node of nodes) {
		if (node.type === KEY_VALUE) {
			if (node.key !== "") {
				result += `${node.fullKey}=${node.fullValue}`;
			}
		} else if (node.type === COMMENT) {
			result += `${node.prefix}${node.comment}`;
		} else if (node.type === INVALID_LINE) {
			result += node.text;
		} else {
			// if someone manually manipulated the node list, we could have an invalid node
			throw new Error(`Invalid node type: ${node.type}`);
		}

		result += "\n";
	}

	// remove extra newline at the end
	return result.slice(0, -1);
}

// maintain reference after name change
export const astToText = nodesToText;

// find node, ensure it's a kv pair, and immutably update its `key` and `fullKey` properties
export function changeKey(nodes, index, newKey) {
	const node = nodes[index];
	if (node.type !== KEY_VALUE) {
		return nodes;
	}

	const key = newKey.trim();
	const newNode = {
		...node,
		key,
		fullKey: node.fullKey.replace(node.key, key),
	};

	const newNodes = nodes.slice(); // clone array since .splice mutates
	newNodes.splice(index, 1, newNode); // replace element at index with newNode
	return newNodes;
}

// find node, ensure it's a kv pair, and immutably update its `value`, `fullValue`, and `quote` properties
export function changeValue(nodes, index, newValue) {
	const node = nodes[index];
	if (node.type !== KEY_VALUE) {
		return nodes;
	}

	// if the new value needs to be escaped (contains a newline or has leading or trailing whitespace), change quote
	// to double quotes, otherwise keep whatever the original node had. if a value later doesn't need to be quoted,
	// it will swap back to the quotes used in the original text
	const quote =
		newValue.match(/\n/) || newValue.match(/^\s/) || newValue.match(/\s$/)
			? '"'
			: node.originalQuote;

	const escapedNewValue = escape(newValue);

	const fullValue = node.fullValue.replace(
		`${node.quote}${node.escapedValue}${node.quote}`,
		`${quote}${escapedNewValue}${quote}`,
	);

	const newNode = {
		...node,
		value: newValue,
		escapedValue: escapedNewValue,
		fullValue,
		quote,
	};

	const newNodes = nodes.slice(); // clone array since .splice mutates
	newNodes.splice(index, 1, newNode); // replace element at index with newNode
	return newNodes;
}

// append a key value pair to the end of the node list
export function appendKeyValue(nodes, key, value) {
	if (key.match(/\s/)) {
		throw new Error("Keys cannot contain whitespace");
	}

	const escapedValue = escape(value);

	const newNode = {
		type: KEY_VALUE,
		key,
		fullKey: key,
		value,
		escapedValue,
		fullValue: escapedValue,

		// if we escaped newlines, set quote
		quote: value !== escapedValue ? '"' : null,
	};

	return [...nodes, newNode];
}

// remove a key value pair from the node list at index
export function removeKeyValue(nodes, index) {
	const node = nodes[index];
	if (node.type !== KEY_VALUE) {
		return nodes;
	}

	const newNodes = nodes.slice(); // clone array since .splice mutates
	newNodes.splice(index, 1); // replace element at index with newNode
	return newNodes;
}

// extract key value pairs from a node list into a Javascript object
export function parseNodes(nodes) {
	const result = {};
	for (const node of nodes) {
		if (node.type === KEY_VALUE) {
			result[node.key] = node.value;
		}
	}
	return result;
}

// maintain reference after name change
export const parseAst = parseNodes;

// leverage textToNodes and parseNodes to extract key value pairs from a dotenv string into a Javascript object
export function parseText(text) {
	const nodes = textToNodes(text);
	return parseNodes(nodes);
}
