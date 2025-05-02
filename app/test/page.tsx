import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight'; // optional for code highlight
import 'highlight.js/styles/github.css'; // or any style you like
import 'katex/dist/katex.min.css';

const message = `
# head 1
## head 2
### head 3

- bullet 1
  - bullet 1.1
  - bullet 1.2
- bullet 2
- bullet 3

1. item 1
2. item 2
3. item 3

# 你好

你好，我是小明。

\`\`\`python
for i in range(5):
  if i == 3:
    print("This is the third iteration")
  else:
    print("This is iteration", i)
\`\`\`
Here is some math: $E = mc^2$.

And a display math block:

$$
\\frac{1}{n} \\sum_{i=1}^{n} x_i
$$

\\[
\\int_{-\\infty}^\\infty e^{-x^2} dx = \\sqrt{\\pi}
\\]

abc
      $$
      \\int_{-\\infty}^\\infty e^{-x^2} dx = \\sqrt{\\pi}
      $$
bcd
    \\[
    P_i = \\frac{\\exp(z'_i)}{\\sum_j \\exp(z'_j)}
    \\]
ddd
  \\[
  P_1 = \\frac{\\exp(4)}{\\exp(4) + \\exp(6) + \\exp(10)} \\approx 0.0001
  \\]
  \\[
  P_2 = \\frac{\\exp(6)}{\\exp(4) + \\exp(6) + \\exp(10)} \\approx 0.002
  \\]
  \\[
  P_3 = \\frac{\\exp(10)}{\\exp(4) + \\exp(6) + \\exp(10)} \\approx 0.998
  \\]
xxx

`;

function normalizeMathMarkdown(markdown: string): string {
  // const text = markdown.replace(/(^|[\n\r]\s*)\\\[(.*?)\\\]($|[\n\r])/gs, (_, prefix, inside, suffix) => `${prefix}$$${inside}$$${suffix}`);
  const text = markdown.replace(/\\\[(.*?)\\\]/gs, (_, inside) => `$$${inside}$$`);
  console.log(text);
  return text;
}

export default function Test() {
  return (
    <main className="flex min-h-screen flex-col items-center m-8 p-4 sm:p-8 md:p-24 bg-gray-50">
      <div className="p-20 m-20 max-w-none bg-gray-100">
        <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
          <ReactMarkdown
            // remarkPlugins={[remarkGfm]}
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex, rehypeHighlight]}
            // components={{
            //   code({ node, inline, className, children, ...props }: any) {
            //     return inline ? (
            //       <code className=" rounded px-1 py-0.5">
            //         {children}
            //       </code>
            //     ) : (
            //       <pre className="bg-yellow-100 rounded-md p-4 overflow-x-auto">
            //         <code className={className} {...props}>
            //           {children}
            //         </code>
            //       </pre>
            //     );
            //   },
            // }}
          >
            {normalizeMathMarkdown(message)}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
