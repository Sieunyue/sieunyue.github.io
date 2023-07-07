'use client'

import { useEffect } from "react"
import { usePathname, useSearchParams } from 'next/navigation'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const Progress = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // You can now use the current URL
    NProgress.start()
  }, [pathname])

  useEffect(() => {
    NProgress.done()
    // You can now use the current URL
  }, [searchParams])

  return null
}

export default Progress