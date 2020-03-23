const test = require("ava");
const complexEnv = require("./_complexEnv");
const {
	removeKeyValue,
	astToText,
	textToAst,
	KEY_VALUE,
} = require("../dotenv.cjs");

test("appendKeyValue appends to the data", (t) => {
	const key = "RETAIN_LEADING_DQUOTE";
	const expected = complexEnv.replace(new RegExp(`^${key}.*\\n`, "gm"), "");

	let ast = textToAst(complexEnv);

	const index = ast.findIndex(
		(node) => node.type === KEY_VALUE && node.key === key,
	);
	ast = removeKeyValue(ast, index);

	t.is(astToText(ast), expected);
});
