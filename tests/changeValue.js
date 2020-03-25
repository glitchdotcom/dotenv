const test = require("ava");
const { nodesToText, textToNodes, changeValue } = require("../dotenv.cjs.js");

const originalValue = "original";
const modifiedValue = "modified";
const modifiedValueWithNewline = "modified\nwith newline";
const modifiedValueWithEscapedNewline = modifiedValueWithNewline.replace(
	/\n/g,
	"\\n",
);
const whitespace = "  \t ";

test("changeValue changes a value", (t) => {
	const original = `KEY=${originalValue}`;
	const modified = `KEY=${modifiedValue}`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValue);

	t.is(nodesToText(nodes), modified);
});

test("changeValue maintains leading whitespace", (t) => {
	const original = `KEY=${whitespace}${originalValue}`;
	const modified = `KEY=${whitespace}${modifiedValue}`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValue);

	t.is(nodesToText(nodes), modified);
});

test("changeValue maintains trailing whitespace", (t) => {
	const original = `KEY=${originalValue}${whitespace}`;
	const modified = `KEY=${modifiedValue}${whitespace}`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValue);

	t.is(nodesToText(nodes), modified);
});

test("changeValue maintains both leading and trailing whitespace when used together", (t) => {
	const original = `KEY=${whitespace}${originalValue}${whitespace}`;
	const modified = `KEY=${whitespace}${modifiedValue}${whitespace}`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValue);

	t.is(nodesToText(nodes), modified);
});

test("changeValue maintains single quotes", (t) => {
	const original = `KEY='${originalValue}'`;
	const modified = `KEY='${modifiedValue}'`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValue);

	t.log(`${original}
${nodesToText(nodes)}`);

	t.is(nodesToText(nodes), modified);
});

test("changeValue maintains double quotes", (t) => {
	const original = `KEY="${originalValue}"`;
	const modified = `KEY="${modifiedValue}"`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValue);

	t.is(nodesToText(nodes), modified);
});

test("changeValue adds double quotes if needed", (t) => {
	const original = `KEY=${originalValue}`;
	const modified = `KEY="${modifiedValueWithEscapedNewline}"`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValueWithNewline);

	t.is(nodesToText(nodes), modified);
});

test("changeValue swaps from single to double quotes if needed", (t) => {
	const original = `KEY='${originalValue}'`;
	const modified = `KEY="${modifiedValueWithEscapedNewline}"`;

	let nodes = textToNodes(original);
	nodes = changeValue(nodes, 0, modifiedValueWithNewline);

	t.is(nodesToText(nodes), modified);
});
