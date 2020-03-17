import test from "ava";
import dedent from "dedent";
import { textToAst, astToText } from "./dotenv.js";

test("textToAst | astToText === identity", (t) => {
	const text = dedent`
		SOME_key=  value
		# i'm a comment
		invalid line
			KEY_2  = something  
`;

	t.is(astToText(textToAst(text)), text);
});
