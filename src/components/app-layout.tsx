'use client'

import AppHeader from '@/components/app-header'
import React, { ReactNode } from 'react'
import { AppFooter } from '@/components/app-footer'
import { ClusterChecker } from '@/components/cluster/cluster-ui'
import { AccountChecker } from '@/components/account/account-ui'

interface Link {
  label: string
  path: string
}

interface AppLayoutProps {
  links: Link[]
  children: ReactNode
}

export function AppLayout({ links, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow container mx-auto p-4">
        <ClusterChecker />
        <AccountChecker />
        {children}
      </main>

      <AppFooter />
    </div>
  )
}
