'use client'

import { useEffect, useRef } from "react"

function setAnimation(parent: HTMLElement) {
  function run(i: number) {
    const el = parent.querySelector(`.t${i}`) as HTMLElement

    if (!el) {
      return
    }

    const len = el.querySelector('.typer-text')?.textContent?.length ?? 0
    el.style.setProperty('--wh', `${len}ch`)
    el.style.setProperty('--animation-status', 'running')
    el.style.setProperty('--character', len + '')
    el.style.setProperty('--animation-duration', 0.07 * len + 's')
    el.setAttribute('animation-running', '')
    const handler = () => {
      if (i < 7) {
        run(++i)
      }

      el.removeEventListener('animationend', handler)
      el.removeAttribute('animation-running')
    }
    el.addEventListener('animationend', handler)
  }

  run(0)
}

const Info = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      setAnimation(ref.current)
    }
  })

  return (
    <div className="info" ref={ref}>
      <div className="m-0 mt-2 pl-2 typer text-sm t0">
        <span className="typer-text">Full-stack developer</span>
      </div>
      <div className="pl-1 mt-8 flex flex-col">
        <p className="typer t1"><span className="typer-text">[x] HTML CSS Sass Tailwindcss</span></p>
        <p className="typer t2"><span className="typer-text">[x] <span className="text-primary">Javascript/Typescript Vue</span> React</span></p>
        <p className="typer t3"><span className="typer-text">[x] UniApp React-Native Next.js <span className="text-primary">WechatApp</span></span></p>
        <p className="typer t4"><span className="typer-text">[x] <span className="text-primary">Webpack</span> Vite Babel Eslint</span></p>
        <p className="typer t5"><span className="typer-text">[x] <span className="text-primary">Node.js</span> Python Java Mysql</span></p>
        <p className="typer t6"><span className="typer-text">[x] Linux Docker Shell Git</span></p>
        <p className="typer t7"><span className="typer-text">[ ] WebGis WebGL Three.js...</span></p>
      </div>
    </div>
  )
}

export default Info