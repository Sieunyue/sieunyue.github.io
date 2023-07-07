import path from "path"
import fs from 'fs-extra'
import React from "react"
import { getPublicDir, sleep } from "@/utils/common"
import matter from "gray-matter"
import Markdown from "./markdown"

type Props = {
  params: {
    slug: string
  }
}

const Article: React.FC<Props> = async (props) => {
  const p = path.join(getPublicDir(), `/article/${decodeURIComponent(props.params.slug).replaceAll('/', '_')}.md`)
  const { content: markdown } = await matter(await fs.readFile(p))

  return (
    <Markdown content={markdown} />
  )
}

export default Article