import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ConfigProvider, theme } from 'antd';
import React from 'react';
import LoginPage from '.';


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider>
        <Component {...pageProps} />
      </ConfigProvider>
      <div className="App">
        <LoginPage />
      </div> 
    </>
  )
}
