importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/8.7.1/firebase-messaging.js')

var firebaseConfig = {
  apiKey: 'AIzaSyBKSR41H4_IrlaAP5iyACDWz-AI4E95fYc',
  authDomain: 'kkuming-2febf.firebaseapp.com',
  projectId: 'kkuming-2febf',
  storageBucket: 'kkuming-2febf.appspot.com',
  messagingSenderId: '48191347873',
  appId: '1:48191347873:web:401c49908d97796b3be4e0',
  measurementId: 'G-QG5KJ41V1P',
}
firebase.initializeApp(firebaseConfig)

const initMessaging = firebase.messaging()
