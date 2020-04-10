const test = require("ava");
const { nodesToText, textToNodes, setQuote } = require("../dotenv.cjs.js");

test("setQuote manually sets the quote of a key value node", (t) => {
	const original = `KEY=value`;
	const modified = `KEY="value"`;

	let nodes = textToNodes(original);

	nodes = setQuote(nodes, 0, '"');
	t.is(nodesToText(nodes), modified);

	nodes = setQuote(nodes, 0, "");
	t.is(nodesToText(nodes), original);
});

test("setQuote can remove quote if there isn't a newline in the value", (t) => {
	const original = `KEY="value"`;
	const single = `KEY='value'`;
	const removed = `KEY=value`;

	let nodes = textToNodes(original);

	nodes = setQuote(nodes, 0, "");
	t.is(nodesToText(nodes), removed);

	nodes = setQuote(nodes, 0, "'");
	t.is(nodesToText(nodes), single);
});

test("setQuote maintains whitespace after setting quote", (t) => {
	const original = `KEY=      value   `;
	const modified = `KEY=      "value"   `;

	let nodes = textToNodes(original);

	nodes = setQuote(nodes, 0, '"');
	t.is(nodesToText(nodes), modified);

	nodes = setQuote(nodes, 0, "");
	t.is(nodesToText(nodes), original);
});

test("setQuote throws an error if you try to remove a quote from a value with a newline", (t) => {
	const original = `KEY="value with\\nnewline"`;

	let nodes = textToNodes(original);
	t.throws(() => setQuote(nodes, 0, ""));
	t.notThrows(() => setQuote(nodes, 0, "'"));
	t.notThrows(() => setQuote(nodes, 0, '"'));
});
