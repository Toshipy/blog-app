import React from 'react';
import '../styles/globals.css'
import '../configureAmplify';
import type { AppProps } from 'next/app';
import Navbar from './components/navbar';
// import { vocabularies } from '../amplify/vocabularies';
import { Auth, I18n } from 'aws-amplify';
import awsconfig from '../src/aws-exports';
import config from '../src/aws-exports';
import '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import Amplify from '@aws-amplify/core'
// import Amplify from 'aws-amplify';

// I18n.putVocabularies(vocabularies);
// I18n.setLanguage('ja');

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

export default MyApp;
