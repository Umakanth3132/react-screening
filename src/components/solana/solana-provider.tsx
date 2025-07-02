'use client'

import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { WalletUi, createWalletUiConfig, createSolanaDevnet, createSolanaLocalnet } from '@wallet-ui/react'

export const WalletButton = dynamic(() => import('@wallet-ui/react').then((mod) => mod.WalletUiDropdown), {
  ssr: false,
})

export const ClusterButton = dynamic(() => import('@wallet-ui/react').then((mod) => mod.WalletUiClusterDropdown), {
  ssr: false,
})

const config = createWalletUiConfig({
  clusters: [createSolanaDevnet(), createSolanaLocalnet()],
})

export function SolanaProvider({ children }: { children: ReactNode }) {
  return <WalletUi config={config}>{children}</WalletUi>
}
