import Image from 'next/image'
import avatar from '@/assets/avatar.jpeg'
import javascript from '@/assets/javascript.svg'
import typescript from '@/assets/typescript.svg'
import html from '@/assets/html.svg'
import css from '@/assets/css.svg'
import sass from '@/assets/sass.svg'
import tailwindcss from '@/assets/tailwindcss.svg'
import vue from '@/assets/vue.svg'
import react from '@/assets/react.svg'
import webpack from '@/assets/webpack.svg'
import vite from '@/assets/vite.svg'
import babel from '@/assets/babel.svg'
import eslint from '@/assets/eslint.svg'
import node from '@/assets/node.svg'
import python from '@/assets/python.svg'
import docker from '@/assets/docker.svg'
import mysql from '@/assets/mysql.svg'
import shell from '@/assets/shell.svg'
import git from '@/assets/git.svg'
import java from '@/assets/java.svg'
import wechat from '@/assets/wechat.svg'
import next from '@/assets/next.svg'

export default function Home() {
  return (
    <>
      <div className="m-auto w-5/12 text-center mt-[8vh]">
        <Image src={avatar} alt="头像" width={120} height={120} />
        <h1>Sieunyue</h1>
      </div>
      <article className="w-5/12 m-auto text-center">
        <p>
          <b>
            Technology stack
          </b>
        </p>
        <div>
          <div className="stack-icon" style={{ backgroundColor: '#f5de19' }}>
            <Image src={javascript} alt="javascript" width={20} height={20} className="align-bottom" />
            <span className="text-regular">&nbsp;javascript</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#3178c6' }}>
            <Image src={typescript} alt="typescript" width={20} height={20} className="align-bottom" />
            <span>&nbsp;typescript</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#f1662a' }}>
            <Image src={html} alt="html" width={20} height={20} className="align-bottom" />
            <span>&nbsp;html</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#33a9dc' }}>
            <Image src={css} alt="css" width={20} height={20} className="align-bottom" />
            <span>&nbsp;css</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#cd6799' }}>
            <Image src={sass} alt="sass" width={20} height={20} className="align-bottom" />
            <span>&nbsp;sass</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#44a8b3' }}>
            <Image src={tailwindcss} alt="tailwindcss" width={20} height={20} className="align-bottom" />
            <span>&nbsp;tailwindcss</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#41b883' }}>
            <Image src={vue} alt="vue" width={20} height={20} className="align-bottom" />
            <span>&nbsp;vue</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#00d8ff' }}>
            <Image src={react} alt="react" width={20} height={20} className="align-bottom" />
            <span className="text-regular">&nbsp;react</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#6698c4' }}>
            <Image src={webpack} alt="webpack" width={20} height={20} className="align-bottom" />
            <span>&nbsp;webpack</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#BD34FE' }}>
            <Image src={vite} alt="vite" width={20} height={20} className="align-bottom" />
            <span>&nbsp;vite</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#f4d44b' }}>
            <Image src={babel} alt="babel" width={20} height={20} className="align-bottom" />
            <span className="text-regular">&nbsp;babel</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#8080f2' }}>
            <Image src={eslint} alt="eslint" width={20} height={20} className="align-bottom" />
            <span>&nbsp;eslint</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#019639' }}>
            <Image src={node} alt="node" width={20} height={20} className="align-bottom" />
            <span>&nbsp;node</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#4775a7' }}>
            <Image src={python} alt="python" width={20} height={20} className="align-bottom" />
            <span>&nbsp;python</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#4294e0' }}>
            <Image src={docker} alt="docker" width={20} height={20} className="align-bottom" />
            <span>&nbsp;docker</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#00758f' }}>
            <Image src={mysql} alt="mysql" width={20} height={20} className="align-bottom" />
            <span>&nbsp;mysql</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#d9b400' }}>
            <Image src={shell} alt="shell" width={20} height={20} className="align-bottom" />
            <span>&nbsp;shell</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#dd4c35' }}>
            <Image src={git} alt="git" width={20} height={20} className="align-bottom" />
            <span>&nbsp;git</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#4286de' }}>
            <Image src={java} alt="java" width={20} height={20} className="align-bottom" />
            <span>&nbsp;java</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#58be6a' }}>
            <Image src={wechat} alt="wechat" width={20} height={20} className="align-bottom" />
            <span>&nbsp;wechat</span>
          </div>
          <div className="stack-icon" style={{ backgroundColor: '#000000' }}>
            <Image src={next} alt="next" width={20} height={20} className="align-bottom" />
            <span>&nbsp;next.js</span>
          </div>
        </div>
      </article>
    </>
  )
}
