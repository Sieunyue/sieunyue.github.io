import { getPublicDir } from '@/utils/common'
import fs from 'fs-extra'
import path from 'path'
import { PostMeta } from './types'
import dayjs from 'dayjs'
import Link from 'next/link'

const getPost = async () => {
  const metaPath = path.join(getPublicDir(), 'post.meta.json')
  
  const metaData = JSON.parse((await fs.readFile(metaPath)).toString()) as PostMeta[]
  
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
      <article className="page-width m-auto">
        <div className="post-list p-0">
          {
            postData.years.map(g => (
              postData.group[g].map((p, i) => (
                <div key={p.title} className="post-list__item mb-9" style={{ '--enter-stage': i } as {}}>
                  <Link href={`/post/${p.title}`}>
                    <span className="text-2xl font-bold">
                      {p.title}
                    </span>
                    <span className="text-gray-500">
                      &emsp;{dayjs(p.date).format('YYYY · MMMM D')}
                    </span>
                  </Link>
                  <div className="flex items-center text-purple-600 space-x-4 my-3">
                    {
                      p.tags.map(t => (
                        <span key={t}>#{t}</span>
                      ))
                    }
                  </div>
                  <div className="text-gray-500 leading-8">
                    {
                      p.description??''
                    }
                  </div>
                </div>
              ))
            ))
          }
        </div>
      </article>
    </>
  )
}

export default Post
