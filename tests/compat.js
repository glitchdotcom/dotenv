/**
 * testing our compatibility with the `dotenv` package https://github.com/motdotla/dotenv
 */

const test = require("ava");
const dotenv = require("dotenv");
const { parseText } = require("../dotenv.cjs.js");
const complexEnv = require("./_complexEnv");

test("compatibility with dotenv", (t) => {
	t.deepEqual(dotenv.parse(complexEnv), parseText(complexEnv));
});
