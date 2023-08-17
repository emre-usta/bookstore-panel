import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider, theme } from 'antd';
import React from 'react';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider theme={{ algorithm: theme.compactAlgorithm }}>
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  )
}