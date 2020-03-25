const test = require("ava");
const complexEnv = require("./_complexEnv");
const { appendKeyValue, nodesToText, textToNodes } = require("../dotenv.cjs");

test("appendKeyValue appends to the data", (t) => {
	const key = "APPENDED_KEY";
	const value = "value";
	const expected = `${complexEnv}
${key}=${value}`;

	let nodes = textToNodes(complexEnv);
	nodes = appendKeyValue(nodes, key, value);

	t.is(nodesToText(nodes), expected);
});
