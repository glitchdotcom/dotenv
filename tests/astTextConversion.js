const test = require("ava");
const { textToNodes, nodesToText } = require("../dotenv.cjs.js");

const complexEnv = require("./_complexEnv");

test("textToNodes into nodesToText is effectively a no-op", (t) => {
	const nodes = textToNodes(complexEnv);
	const reconstituted = nodesToText(nodes);

	t.is(reconstituted, complexEnv, "reconstituted should be the as original");
});
