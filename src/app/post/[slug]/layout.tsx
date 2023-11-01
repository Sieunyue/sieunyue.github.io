import { FC, PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{}>

const Layout: FC<Props> = async (props) => {
  return (
    <>
      <div className="page-width mx-auto">
        {props.children}
      </div>
    </>
  )
}

export default Layout
