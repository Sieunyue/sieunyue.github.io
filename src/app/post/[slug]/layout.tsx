import { getPublicDir } from "@/utils/common"
import matter from "gray-matter"
import path from "path"
import fs from 'fs-extra'
import { FC, PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{
  catalog: ReactNode
}>

const Layout: FC<Props> = async (props) => {
  return (
    <>
      <div className="w-6/12 m-auto mt-[4vh]">
        {props.children}
      </div>
      <div>
        {props.catalog}
      </div>
    </>
  )
}

export default Layout