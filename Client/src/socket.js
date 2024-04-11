import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? "https://chuck127.easterndns.com:1080" : 'http://192.168.0.179:5000';

export const socket = io(URL, {
    transportOptions: {
      polling: {
        extraHeaders: {
          'Authorization': localStorage.getItem("token"),
        },
      },
    },
  });
