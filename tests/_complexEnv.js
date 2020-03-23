/**
 * helper script to let tests `require()` the `complexEnv.data` file.
 * the `complexEnv.data` file data was mostly taken from https://github.com/motdotla/dotenv/blob/7301ac9be0b2c766f865bbe24280bf82586d25aa/tests/.env
 */

const fs = require("fs");
const path = require("path");

const filename = "complexEnv.data";

module.exports = fs.readFileSync(path.join(__dirname, filename), "utf8");
