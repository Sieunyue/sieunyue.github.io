import path from "path"
import fs from 'fs-extra'
import React from "react"
import matter from "gray-matter"
import remarkGfm from 'remark-gfm'
import { getPublicDir } from "@/utils/common"
import { PostMeta } from "../types"
import rehypeHighlight from 'rehype-highlight'
import { unified } from "unified"
import remarkParse from 'remark-parse'
import remarkRehype from "remark-rehype"
import rehypeStringify from "rehype-stringify"
import remarkHeadingId from 'remark-heading-id'

type Props = {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const metaPath = path.join(getPublicDir(), 'post.meta.json')

  const posts = JSON.parse((await fs.readFile(metaPath)).toString()) as PostMeta[]

  return posts.map((post) => ({
    slug: post.title
  }))
}

const Article: React.FC<Props> = async (props) => {
  const p = path.join(getPublicDir(), `/article/${decodeURIComponent(props.params.slug).replaceAll('/', '_')}.md`)
  const { content: markdown } = await matter(await fs.readFile(p))

  const s = (await unified().use(remarkParse).use(remarkGfm).use(remarkHeadingId).use(remarkRehype).use(rehypeHighlight).use(rehypeStringify).process(markdown)).toString()

  return (
    <div className="markdown" dangerouslySetInnerHTML={{ __html: s }}></div>
  )
}

export default Article