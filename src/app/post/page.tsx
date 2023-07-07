import { getPublicDir } from "@/utils/common"
import fs from 'fs-extra'
import matter from "gray-matter"
import path from "path"
import { PostMeta } from "./types"
import dayjs from "dayjs"
import Link from "next/link"

const getPost = async () => {
  const dirs = path.join(getPublicDir(), '/article')
  const posts = await fs.readdir(dirs)

  const metaData = await Promise.all(posts.map(async p => await fs.readFile(path.join(dirs, p)).then(d => matter(d).data as PostMeta)))

  metaData.sort((a, b) => b.date.valueOf() - a.date.valueOf())

  const group: Record<string, PostMeta[]> = {}

  metaData.forEach(m => {
    const year = dayjs(m.date).year() + ''

    if (!group[year]) {
      group[year] = []
    }

    group[year].push(m)
  })


  const years = Object.keys(group)

  years.sort((a, b) => parseInt(b) - parseInt(a))

  return {
    years,
    group
  }
}

const Post = async () => {
  const postData = await getPost()

  return (
    <>
      <article className="w-5/12 m-auto mt-[4vh]">
        <div className="post-list p-0">
          {
            postData.years.map(g => (
              <>
                <p key={g} className="relative h-14 pointer-events-none">
                  <span className="post-year">
                    {g}
                  </span>
                </p>
                {
                  postData.group[g].map((p, i) => (
                    <p key={p.title} className="post-list__item" style={{ '--enter-stage': i } as {}} >
                      <Link href={`/post/${encodeURIComponent(p.title)}`} className="post-list__title">
                        {p.title}&nbsp;
                        <span className="text-sm text-secondary">
                          {
                            p.tags.map(t => (
                              <span key={t}>{t}&nbsp;</span>
                            ))
                          }
                          ·&nbsp;
                          {dayjs(p.date).format('MMM D')}
                        </span>
                      </Link>
                    </p>
                  ))
                }
              </>
            ))
          }
        </div>
      </article>
    </>
  )
}

export default Post