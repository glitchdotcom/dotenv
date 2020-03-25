const test = require("ava");
const complexEnv = require("./_complexEnv");
const {
	removeKeyValue,
	nodesToText,
	textToNodes,
	KEY_VALUE,
} = require("../dotenv.cjs");

test("appendKeyValue appends to the data", (t) => {
	const key = "RETAIN_LEADING_DQUOTE";
	const expected = complexEnv.replace(new RegExp(`^${key}.*\\n`, "gm"), "");

	let nodes = textToNodes(complexEnv);

	const index = nodes.findIndex(
		(node) => node.type === KEY_VALUE && node.key === key,
	);
	nodes = removeKeyValue(nodes, index);

	t.is(nodesToText(nodes), expected);
});
