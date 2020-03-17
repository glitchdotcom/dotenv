const test = require("ava");
const dedent = require("dedent");
const { astToText, textToAst } = require("./dotenv.cjs.js");

test("textToAst | astToText === identity", (t) => {
	const text = dedent`
		SOME_key=  value
		# i'm a comment
		invalid line
			KEY_2  = something  
`;

	t.is(astToText(textToAst(text)), text);
});
