// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyAWt_0Is30OC8KvXoIO2xYHrlbzOCyh8O0',
    authDomain: 'chat-app-92212.firebaseapp.com',
    databaseURL: 'https://chat-app-92212.firebaseio.com',
    projectId: 'chat-app-92212',
    storageBucket: 'chat-app-92212.appspot.com',
    messagingSenderId: '434577239591'
  },
  googleId: '567876676719-a47oo12ltbe7011b566a46ogaj35jv46.apps.googleusercontent.com',
  webRTCConfig: {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  },
  peerKey: 'lwjd5qra8257b9'
};
