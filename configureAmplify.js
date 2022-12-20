import Amplify from '@aws-amplify/core'
import { Auth } from 'aws-amplify';
// import awsconfig from './src/aws-exports';
import config from './src/aws-exports';

Amplify.configure(config);
// Auth.configure(awsconfig);
