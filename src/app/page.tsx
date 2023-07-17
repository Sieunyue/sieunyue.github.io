import Image from 'next/image'
import icon from '@/assets/svg/icon.svg'
import Info from './info'
import SvgIcon from '@/components/svg-icon'
// import h from '@/assets/home.svg'

export default function Home() {
  return (
    <div className="px-16 pt-12 pb-8 w-9/12 mx-auto relative">
      <div className="relative pr-[600px]">
        <Image className="absolute left-8 top-3" src={icon} alt="next" width={60} height={60}></Image>
        <div className="pl-28 flex flex-col">
          <p className="text-6xl font-bold m-0 leading-tight">Sieunyue</p>
          <Info />
        </div>

        <div className="absolute right-40 top-12">
          <SvgIcon name="icon-home" size={400} />
        </div>
      </div>
    </div>
  )
}
