import { CSSProperties, FC } from "react"

type Props = {
  name: Icon
  className?: string
  style?: CSSProperties
}

const SvgIcon: FC<Props> = (props) => {
  const { name, className, style } = props

  return (
    <svg className={className} style={style} >
      <use xlinkHref={`#${name}`} />
    </svg>
  )
}

export default SvgIcon