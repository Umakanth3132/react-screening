import { WalletUiDropdown } from '@wallet-ui/react'
import Image from 'next/image'

interface Link {
  label: string
  path: string
}

export default function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <div className="flex items-center gap-2">
        <Image src="/third-time-icon-tiny-white.png" alt="Third Time" width={32} height={32} />
        <span className="text-lg font-semibold">Third Time</span>
      </div>
      <WalletUiDropdown />
    </header>
  )
}
