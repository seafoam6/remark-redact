import dedent from 'dedent';
import unified from 'unified';
import stream from 'unified-stream';
import reParse from 'remark-parse';
import remark2rehype from 'remark-rehype';
import com from 'remark-comments';

import plugin from '../src';

import remarkStringify from 'remark-stringify';
import rehypeStringify from 'rehype-stringify';

describe('Remark Redact w/o settings', () => {
  const render = text =>
    unified()
      .use(reParse)
      .use(plugin)
      .use(remark2rehype)
      .use(rehypeStringify)
      .processSync(text);

  describe('simple single', () => {
    const {contents} = render(dedent`
    Please don't show my /~ Secret Stuff ~/
  `);
    it('It should block out the redacted text', () => {
      expect(contents).not.toContain('Secret');
    });

    it('It should match expected output', () => {
      expect(contents).toEqual("<p>Please don't show my  ██████ █████ </p>");
    });
  });
  describe('multiple', () => {
    const {contents} = render(dedent`
          The "Fighting Téméraire" was a line-of-battle ship of ninety-eight
      guns which /~Lord Nelson~/ captured from the French at the battle of the
      Nile, August 1, 1798. In the battle of Trafalgar, October 21, 1805,
      she fought next to the "Victory"--the ship from which Nelson commanded
      the battle, and aboard which, in the course of it, he was killed. She
      was sold out of the service in 1838, and towed to Rotherhithe to be
      broken up. Turner's painting was exhibited at the Royal Academy
      of 1839. His picture touched the /~popular heart, and though no
      reproduction in black and white can approach the splendor of color in
      the original, the engraving renders faithfully the~/ sentiment of the
      picture.
  `);
    it('It should block out the redacted text', () => {
      expect(contents).not.toContain('Lord Nelson');
      expect(contents).not.toContain('heart');
    });

    it('It should match snapshot', () => {
      expect(contents).toMatchSnapshot();
    });
  });
});

describe('Remark Redact with settings', () => {
  describe('Replacer', () => {
    const render = text =>
      unified()
        .use(reParse)
        .use(plugin, {replacer: 'x'})
        .use(remark2rehype)
        .use(rehypeStringify)
        .processSync(text);

    const {contents} = render(dedent`
    Please don't show my /~ Secret Stuff ~/
  `);
    it('It should block out the redacted text with custom replacer', () => {
      expect(contents).not.toContain('Secret');
    });

    it('It should match expected output', () => {
      expect(contents).toEqual("<p>Please don't show my  xxxxxx xxxxx </p>");
    });
  });

  describe('custom tokens', () => {
    const render = text =>
      unified()
        .use(reParse)
        .use(plugin, {beginMarker: '<', endMarker: '>'})
        .use(remark2rehype)
        .use(rehypeStringify)
        .processSync(text);

    const {contents} = render(dedent`
    Please don't show my < Secret Stuff >
  `);
    it('It should block out the redacted text with custom replacer', () => {
      expect(contents).not.toContain('Secret');
    });

    it('It should match expected output', () => {
      expect(contents).toEqual("<p>Please don't show my  ██████ █████ </p>");
    });
  });

  describe('pairs only', () => {
    const render = text =>
      unified()
        .use(reParse)
        .use(plugin)
        .use(remark2rehype)
        .use(rehypeStringify)
        .processSync(text);

    const {contents} = render(dedent`
    Please don't show my /~ Secret Stuff 
  `);
    it('It should NOT redact any test', () => {
      expect(contents).toContain('Secret');
    });

    it('It should match expected output', () => {
      expect(contents).toEqual("<p>Please don't show my /~ Secret Stuff</p>");
    });
  });
});

test('compiles to markdown', () => {
  const renderToMarkdown = text =>
    unified()
      .use(reParse)
      .use(remarkStringify)
      .use(plugin)
      .processSync(text);

  const {contents} = renderToMarkdown(dedent`
    Please don't show my /~ Secret Stuff ~/
  `);

  expect(contents).toContain("Please don't show my  ██████ █████");
});
