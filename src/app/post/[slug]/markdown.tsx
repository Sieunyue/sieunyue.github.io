'use client'
import { FC } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark as theme } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'

type Props = {
  content: string
}

const Markdown: FC<Props> = (props) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      className="markdown"
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <SyntaxHighlighter
              {...props}
              style={theme}
              customStyle={{ fontSize: 12 }}
              language={match[1]}
              PreTag="div"
              showLineNumbers
              wrapLongLines
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          )
        } 
        // h1(h){
        //   return (
        //     <div>
        //         <h1>{h.children?.[0]}</h1>
        //         <p>16min</p>
        //     </div>
        //   )
        // }
      }}
    >{props.content}</ReactMarkdown>
  )
}

export default Markdown