import '../lib/day'
import type { AppProps } from 'next/app'
import { globalStyle } from '@/styles/global'
import { SessionProvider } from 'next-auth/react'

globalStyle()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
