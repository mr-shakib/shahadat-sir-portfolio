import "server-only";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import sql from "highlight.js/lib/languages/sql";
import MarkdownIt from "markdown-it";
import { slugify } from "@/content/slug";

for (const [name, lang] of Object.entries({ bash, c, cpp, java, javascript, python, sql }))
  hljs.registerLanguage(name, lang);

export type Heading = { id: string; text: string; level: 2 | 3 };

// Raw HTML is escaped (html: false) and markdown-it refuses javascript: and similar links,
// so the output is safe to insert as HTML.
const md: MarkdownIt = new MarkdownIt({
  html: false,
  linkify: false,
  typographer: false,
  highlight(code, lang) {
    if (!lang || !hljs.getLanguage(lang)) return "";
    const html = hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
    return `<pre class="hljs" data-lang="${md.utils.escapeHtml(lang)}"><code>${html}</code></pre>`;
  },
});

const defaultImage = md.renderer.rules.image!;
md.renderer.rules.image = (tokens, idx, options, env, self) => {
  tokens[idx].attrSet("loading", "lazy");
  tokens[idx].attrSet("decoding", "async");
  return defaultImage(tokens, idx, options, env, self);
};

md.renderer.rules.link_open = (tokens, idx, options, _env, self) => {
  if (/^https?:\/\//.test(tokens[idx].attrGet("href") ?? "")) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener noreferrer");
  }
  return self.renderToken(tokens, idx, options);
};

/** Renders lecture notes, giving h2/h3 headings ids so they can be linked to. */
export function renderMarkdown(source: string | undefined) {
  const tokens = md.parse(source ?? "", {});
  const headings: Heading[] = [];
  const used = new Set<string>();
  tokens.forEach((token, i) => {
    if (token.type !== "heading_open" || (token.tag !== "h2" && token.tag !== "h3")) return;
    const text = (tokens[i + 1]?.children ?? [])
      .map((t) => (t.type === "text" || t.type === "code_inline" ? t.content : ""))
      .join("");
    let id = slugify(text) || "section";
    for (let n = 2; used.has(id); n++) id = `${slugify(text) || "section"}-${n}`;
    used.add(id);
    token.attrSet("id", id);
    headings.push({ id, text, level: token.tag === "h2" ? 2 : 3 });
  });
  return { html: md.renderer.render(tokens, md.options, {}), headings };
}
