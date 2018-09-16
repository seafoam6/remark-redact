# remark-redact

This plugin parses markdown to obscure passages between two tokens.

## Syntax

You can redact passages of your text like this:

```
  Please don't show my /~ Secret Stuff ~/
```

Any alphanumeric characters between the `/~` and `~/` will will be replaced with a `█`.

## WARNING

This plugin obscures text from being read after it is processed. If your source markdown files reside on a public repo, they will, obviously, not be protected by this plugin.

## Configuration

There are currently three options available, which are passed in via a single configuration object.

    {beginMarker = '/~', endMarker = '~/', replacer: '█'}

Therefore, invoking this plugin this way:

```js
  .use(redact, {
    beginMarker: '<',
    endMarker: '>',
    replacer: 'X'
  })
```

will make this plugin remove what's put between `<` and `>` and replace those characters with `X`.

## Usage

Dependencies:

```javascript
const unified = require("unified");
const remarkParse = require("remark-parse");
const stringify = require("rehype-stringify");
const remark2rehype = require("remark-rehype");

const remarkRedact = require("remark-redact");
```

Usage:

```javascript
unified()
  .use(remarkParse)
  .use(remarkRedact)
  .use(remark2rehype)
  .use(stringify);
```

## License

[MIT][license] © [Steve Barman][seafoam6]

Redact is very very heavily indebted to [remark-comments](https://github.com/zestedesavoir/zmarkdown/tree/master/packages/remark-comments)

<!-- Definitions -->

[seafoam6]: https://stevebarman.com
[license]: https://github.com/seafoam6/remark-redact/blob/master/LICENSE
