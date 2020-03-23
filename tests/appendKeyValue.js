const test = require("ava");
const complexEnv = require("./_complexEnv");
const { appendKeyValue, astToText, textToAst } = require("../dotenv.cjs");

test("appendKeyValue appends to the data", (t) => {
	const key = "APPENDED_KEY";
	const value = "value";
	const expected = `${complexEnv}
${key}=${value}`;

	let ast = textToAst(complexEnv);
	ast = appendKeyValue(ast, key, value);

	t.is(astToText(ast), expected);
});
