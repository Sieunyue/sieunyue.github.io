import Image from 'next/image'
import icon from '@/assets/icon.svg'
import Info from './info'

export default function Home() {
  return (
    <div className="px-16 pt-16 pb-8 w-10/12 mx-auto">
      <div className="relative">
        <Image className="absolute left-8 top-3" src={icon} alt="next" width={60} height={60}></Image>
        <div className="pl-28 flex flex-col">
          <p className="text-6xl font-bold m-0 leading-tight">Sieunyue</p>
          <Info />
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}
