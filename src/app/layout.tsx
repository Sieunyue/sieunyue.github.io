import Link from 'next/link'
import Progress from './porgress'
import { Suspense } from 'react'
import fs from 'fs-extra'
import "highlight.js/styles/atom-one-dark.css"
import '@/theme/globals.scss'

export const metadata = {
  title: 'Sieunyue'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="/svg_cdn.js" defer/>
      </head>
      <body>
        <header>
          <nav className="page-width nav py-8 mx-auto">
            <Link href="/">Home</Link>
            <Link href="/post">Post</Link>
            <a>Tags</a>
            <Link href="/demo">Demo</Link>
          </nav>
        </header>
        <main>
          {/* <BackgroundCanvas /> */}
          {children}
        </main>
        <footer className="mt-16 mb-8">
          <p className="text-sm opacity-50 text-secondary m-auto w-5/12 text-center">

            <span className="copyright">
              © 2023 Sieunyue. All rights reserved.
            </span>
          </p>
        </footer>
        <Suspense fallback={null}>
          <Progress />
        </Suspense>
      </body>
    </html>
  )
}
