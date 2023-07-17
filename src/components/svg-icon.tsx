import { FC } from "react"

type Props = {
  name: Icon,
  size?: number
}

const SvgIcon: FC<Props> = (props) => {
  const { size = 60, name } = props

  return (
    <svg width={size} height={size}>
      <use xlinkHref={`#${name}`} />
    </svg>
  )
}

export default SvgIcon