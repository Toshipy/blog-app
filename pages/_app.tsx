import '../styles/globals.css'
import '../configureAmplify';
import type { AppProps } from 'next/app';
import Navbar from './components/navbar';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
