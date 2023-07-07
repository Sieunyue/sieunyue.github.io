import path from "path"
import fs from 'fs-extra'
import React, { FC } from "react"
import { getPublicDir } from "@/utils/common"
import matter from "gray-matter"
import {fromMarkdown} from 'mdast-util-from-markdown'
import { Content } from "mdast-util-from-markdown/lib"

type Props = {
  params: {
    slug: string
  }
}

type CatalogTree = {

}

const Catalog: FC<Props> = async (props)=>{
  // const p = path.join(getPublicDir(), `/article/${decodeURIComponent(props.params.slug).replaceAll('/', '_')}.md`)
  // const { content: markdown } = await matter(await fs.readFile(p))
  
  // console.log(fromMarkdown(markdown))

  return (
    null  
  )
}

export default Catalog