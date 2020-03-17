// test script pls ignore

import {
  textToAst,
  astToText,
  changeKey,
  changeValue,
  parseAst,
  appendKeyValue,
  removeKeyValue
} from "./index.js";

const text = `TEST_KEY=asdf   # blah blah
something=  true
invalid
# some comment
blah  ="a \\nsdf"  `;

let ast = textToAst(text);

ast = changeKey(ast, 0, "NEXT_KEY");
ast = changeValue(ast, 4, "other\nvalue");
ast = appendKeyValue(ast, "some-key", "some\nvalue");
ast = changeValue(ast, ast.length - 1, "next\n valyue");
ast = removeKeyValue(ast, 1);

console.log(ast);

console.log(astToText(ast));
