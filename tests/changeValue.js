const test = require("ava");
const { astToText, textToAst, changeValue } = require("../dotenv.cjs.js");

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

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValue);

	t.is(astToText(ast), modified);
});

test("changeValue maintains leading whitespace", (t) => {
	const original = `KEY=${whitespace}${originalValue}`;
	const modified = `KEY=${whitespace}${modifiedValue}`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValue);

	t.is(astToText(ast), modified);
});

test("changeValue maintains trailing whitespace", (t) => {
	const original = `KEY=${originalValue}${whitespace}`;
	const modified = `KEY=${modifiedValue}${whitespace}`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValue);

	t.is(astToText(ast), modified);
});

test("changeValue maintains both leading and trailing whitespace when used together", (t) => {
	const original = `KEY=${whitespace}${originalValue}${whitespace}`;
	const modified = `KEY=${whitespace}${modifiedValue}${whitespace}`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValue);

	t.is(astToText(ast), modified);
});

test("changeValue maintains single quotes", (t) => {
	const original = `KEY='${originalValue}'`;
	const modified = `KEY='${modifiedValue}'`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValue);

	t.log(`${original}
${astToText(ast)}`);

	t.is(astToText(ast), modified);
});

test("changeValue maintains double quotes", (t) => {
	const original = `KEY="${originalValue}"`;
	const modified = `KEY="${modifiedValue}"`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValue);

	t.is(astToText(ast), modified);
});

test("changeValue adds double quotes if needed", (t) => {
	const original = `KEY=${originalValue}`;
	const modified = `KEY="${modifiedValueWithEscapedNewline}"`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValueWithNewline);

	t.is(astToText(ast), modified);
});

test("changeValue swaps from single to double quotes if needed", (t) => {
	const original = `KEY='${originalValue}'`;
	const modified = `KEY="${modifiedValueWithEscapedNewline}"`;

	let ast = textToAst(original);
	ast = changeValue(ast, 0, modifiedValueWithNewline);

	t.is(astToText(ast), modified);
});
