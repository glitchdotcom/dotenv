const test = require("ava");
const { astToText, textToAst, changeKey } = require("../dotenv.cjs.js");

const originalKey = "ORIGINAL_KEY";
const modifiedKey = "MODIFIED_KEY";
const whitespace = "  \t ";

test("changeKey changes a key", (t) => {
	const original = `${originalKey}=value`;
	const modified = `${modifiedKey}=value`;

	let ast = textToAst(original);
	ast = changeKey(ast, 0, modifiedKey);

	t.is(astToText(ast), modified);
});

test("changeKey maintains leading whitespace", (t) => {
	const original = `${whitespace}${originalKey}=value`;
	const modified = `${whitespace}${modifiedKey}=value`;

	let ast = textToAst(original);
	ast = changeKey(ast, 0, modifiedKey);

	t.is(astToText(ast), modified);
});

test("changeKey maintains trailing whitespace", (t) => {
	const original = `${originalKey}${whitespace}=value`;
	const modified = `${modifiedKey}${whitespace}=value`;

	let ast = textToAst(original);
	ast = changeKey(ast, 0, modifiedKey);

	t.is(astToText(ast), modified);
});

test("changeKey maintains both leading and trailing whitespace when used together", (t) => {
	const original = `${whitespace}${originalKey}${whitespace}=value`;
	const modified = `${whitespace}${modifiedKey}${whitespace}=value`;

	let ast = textToAst(original);
	ast = changeKey(ast, 0, modifiedKey);

	t.is(astToText(ast), modified);
});
