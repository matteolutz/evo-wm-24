import io from 'socket.io-client';

const WS_HOST = 'localhost';
const WS_PORT = '80';

export const wsConnect = () => {
  return io(`http://${WS_HOST}:${WS_PORT}`);
};
