import dedent from 'dedent';
import unified from 'unified';
import stream from 'unified-stream';
import reParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import com from 'remark-comments';

import plugin from '../src';

import remarkStringify from 'remark-stringify';
import rehypeStringify from 'rehype-stringify';

const renderToMarkdown = text =>
  unified()
    .use(reParse)
    .use(remarkStringify)
    .use(plugin)
    .processSync(text)

test('comments', () => {
  const render = text =>
    unified()
      .use(reParse)
      .use(com)
      .use(remark2rehype)
      .use(rehypeStringify)
      .processSync(text)

  const {contents} = render(dedent`
    Foo<--COMMENTS I will be gone ABC COMMENTS-->bar
    \`\`\`
    Foo<--COMMENTS I will not get removed because I am in a code block DEF COMMENTS-->bar
    \`\`\`
    <--COMMENTS Unfinished block won't get parsed either GHI
  `)
  //expect(contents).toMatchSnapshot()
  expect(contents).not.toContain('ABC')
  expect(contents).toContain('DEF')
  expect(contents).toContain('GHI')
})

// test('compiles to markdown', () => {
//   const { contents } = renderToMarkdown(dedent`
//     Foo<--COMMENTS I will be gone ABC COMMENTS-->bar
//     \`\`\`
//     Foo<--COMMENTS I will not get removed because I am in a code block DEF COMMENTS-->bar
//     \`\`\`
//     <--COMMENTS Unfinished block won't get parsed either GHI
//   `)
//   expect(contents).toMatchSnapshot()
//   expect(contents).toContain(
//     'Foo<--COMMENTS I will be gone ABC COMMENTS-->bar'
//   )
// })
