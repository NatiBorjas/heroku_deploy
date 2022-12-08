const parseArgs = require("minimist");
const dotenv = require("dotenv");

dotenv.config();

const args = parseArgs(process.argv.slice(2));

const PORT = args.PORT || process.env.PORT || 8080;
const MONGOPSW = process.env.MONGOATLASPW;

let MODO;
if (args["_"].includes("CLUSTER")) {
  MODO = "CLUSTER";
} else {
  MODO = "FORK";
}

module.exports = { MONGOPSW, PORT, MODO };