import './globals.css'
import { AppProviders } from '@/components/app-providers'
import { AppLayout } from '@/components/app-layout'

const links = [{ label: 'Home', path: '/' }]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased" suppressHydrationWarning={true}>
        <AppProviders>
          <AppLayout links={links}>{children}</AppLayout>
        </AppProviders>
      </body>
    </html>
  )
}
