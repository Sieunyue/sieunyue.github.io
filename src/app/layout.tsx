import Link from 'next/link'
import BackgroundCanvas from './bg'
import './globals.scss'
import Progress from './porgress'
import { Suspense } from 'react'

export const metadata = {
  title: 'Sieunyue'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav className="p-8 nav">
            <Link href="/">Home</Link>
            <Link href="/post">Post</Link>
            <a>Tags</a>
            <a>Demo</a>
          </nav>
        </header>
        <main>
          <BackgroundCanvas />
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
