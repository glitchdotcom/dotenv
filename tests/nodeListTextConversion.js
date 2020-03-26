const test = require("ava");
const { textToNodes, nodesToText, INVALID_LINE } = require("../dotenv.cjs.js");

const complexEnv = require("./_complexEnv");

test("textToNodes into nodesToText is effectively a no-op", (t) => {
	const nodes = textToNodes(complexEnv);
	const reconstituted = nodesToText(nodes);

	t.is(reconstituted, complexEnv, "reconstituted should be the as original");
});

test("textToNodes produces an invalid line if the key is empty", (t) => {
	const env = `=some value`;
	const nodes = textToNodes(env);

	t.is(nodes.length, 1, "there should only be one node");
	t.deepEqual(nodes[0], {
		type: INVALID_LINE,
		text: env,
	});
});
