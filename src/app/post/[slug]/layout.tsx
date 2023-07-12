import { FC, PropsWithChildren, ReactNode } from "react"

type Props = PropsWithChildren<{}>

const Layout: FC<Props> = async (props) => {
  return (
    <>
      <div className="w-6/12 m-auto mt-[2vh]">
        {props.children}
      </div>
    </>
  )
}

export default Layout