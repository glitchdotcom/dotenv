/**
 * TODO
 * - comments! docs! cleanup!
 */

export const EMPTY_LINE = "EMPTY_LINE";
export const KEY_VALUE = "KEY_VALUE";
export const COMMENT = "COMMENT";
export const INVALID_LINE = "INVALID_LINE";

function splitAtFirst(string, delimiter) {
	const [first, ...rest] = string.split(delimiter);
	return [first, rest.length > 0 ? rest.join(delimiter) : null];
}

function parseLine(line) {
	// Empty line

	if (line.trim() === "") {
		return { type: EMPTY_LINE };
	}

	// Comment

	const [firstNonWhitespaceChar] = line.match(/\S/) || [];
	if (firstNonWhitespaceChar === "#") {
		const [_full, prefix, comment] = line.match(/(^\s*#\s*)(.*)/);
		return { type: COMMENT, prefix, comment };
	}

	// KV Pair

	const [fullKey, fullValue] = splitAtFirst(line, "=");

	// fullValue === null means there's no = in the line
	if (fullValue === null) {
		return { type: INVALID_LINE, text: line };
	}

	const key = fullKey.trim();

	// keys can't contain whitespace
	if (key.match(/\s/)) {
		return { type: INVALID_LINE, text: line };
	}

	const [valuePrefix] = fullValue.match(/^\s+/) || [""];
	const [valueSuffix] = fullValue.match(/\s+$/) || [""];
	let value = fullValue.trim();

	let quoted = false;
	const [startQuote] = value.match(/^("|')/) || [];
	if (startQuote && value.endsWith(startQuote)) {
		value = value.slice(1, -1);
		quoted = true;
	}

	if (startQuote === '"') {
		value = value.replace(/\\n/g, "\n");
	}

	const quote = quoted ? startQuote : "";

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

export function textToAst(text) {
	const lines = text.split("\n");
	const result = [];

	for (const line of lines) {
		result.push(parseLine(line));
	}

	return result;
}

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
			// pass
		} else {
			throw new Error(`Invalid node type: ${node.type}`);
		}
		result += "\n";
	}

	return result.replace(/\n$/, "");
}

export function changeKey(ast, i, newKey) {
	const node = ast[i];
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
	newAst.splice(i, 1, newNode);
	return newAst;
}

export function changeValue(ast, i, newValue) {
	const node = ast[i];
	if (node.type !== KEY_VALUE) {
		return ast;
	}
	const quote =
		newValue.match(/\n/) || newValue.match(/^\s/) || newValue.match(/\s$/)
			? '"'
			: node.originalQuote;
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
	newAst.splice(i, 1, newNode);
	return newAst;
}

export function appendKeyValue(ast, key, value) {
	if (key.match(/\s/)) {
		throw new Error("Keys cannot contain whitespace");
	}

	const needsQuote = value.includes("\n");
	const newNode = {
		type: KEY_VALUE,
		key,
		fullKey: key,
		value,
		fullValue: needsQuote ? `"${value.replace("\n", "\\n")}"` : value,
		valuePrefix: "",
		valueSuffix: "",
		quote: needsQuote ? '"' : null,
	};

	return [...ast, newNode];
}

export function removeKeyValue(ast, index) {
	const node = ast[index];
	if (node.type !== KEY_VALUE) {
		return ast;
	}
	const newAst = ast.slice();
	newAst.splice(index, 1);
	return newAst;
}

export function parseAst(ast) {
	const result = {};
	for (const node of ast) {
		if (node.type === KEY_VALUE) {
			result[node.key] = node.value;
		}
	}
	return result;
}

export function parseText(text) {
	const ast = textToAst(text);
	return parseAst(ast);
}
