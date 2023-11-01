import Image from 'next/image'
import icon from '@/assets/svg/icon.svg'
import Info from './info'
import SvgIcon from '@/components/svg-icon'
// import h from '@/assets/home.svg'

export default function Home() {
  return (
    <div className="home__card mx-auto relative">
      <div className="relative home__card-left">
        <SvgIcon className="absolute left-8 top-2 w-16 h-16" name="icon-icon" />
        <div className="pl-28 flex flex-col">
          <p className="text-6xl font-bold m-0 leading-tight">Sieunyue</p>
          <Info />
        </div>
      </div>

      <div className="home__card-right absolute right-8 top-12">
          <SvgIcon className="w-full h-full" name="icon-home" />
        </div>
    </div>
  )
}
