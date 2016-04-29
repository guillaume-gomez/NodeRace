var fs = require("fs");

var config = JSON.parse(fs.readFileSync("./public/config.json","utf8"));

module.exports = config;
