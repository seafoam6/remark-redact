var unified = require("unified");
var stream = require("unified-stream");
var markdown = require("remark-parse");
var remark2rehype = require("remark-rehype");
var html = require("rehype-stringify");
var redact = require("./index");

var processor = unified()
  .use(markdown)
  .use(redact)
  .use(remark2rehype)
  .use(html);

process.stdin.pipe(stream(processor)).pipe(process.stdout);
