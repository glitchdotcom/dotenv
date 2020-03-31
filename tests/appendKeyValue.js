const test = require("ava");
const complexEnv = require("./_complexEnv");
const {
	appendKeyValue,
	changeKey,
	changeValue,
	nodesToText,
	textToNodes,
} = require("../dotenv.cjs");

test("appendKeyValue appends to the data", (t) => {
	const key = "APPENDED_KEY";
	const value = "value";
	const expected = `${complexEnv}
${key}=${value}`;

	let nodes = textToNodes(complexEnv);
	nodes = appendKeyValue(nodes, key, value);

	t.is(nodesToText(nodes), expected);
});

test("appendKeyValue works with empty kv pairs", (t) => {
	const key = "APPENDED_KEY";
	const value = "value";

	let nodes = textToNodes(``);
	nodes = appendKeyValue(nodes, "", "");
	nodes = changeKey(nodes, 0, key);
	nodes = changeValue(nodes, 0, value);

	t.is(nodesToText(nodes), `${key}=${value}`);
});
