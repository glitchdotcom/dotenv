const test = require("ava");
const { textToAst, astToText } = require("../dotenv.cjs.js");

const complexEnv = require("./_complexEnv");

test("textToAst into astToText is effectively a no-op", (t) => {
	const ast = textToAst(complexEnv);
	const reconstituted = astToText(ast);

	t.is(reconstituted, complexEnv, "reconstituted should be the as original");
});
