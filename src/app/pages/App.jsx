import React, { StrictMode } from 'react';
import { Provider } from 'jotai';

import { isAuthenticated } from '../../client/state/auth';

import Auth from '../templates/auth/Auth';
import Client from '../templates/client/Client';
// const supportRoomID = import.meta.env.VITE_SUPPORT_ROOM_ID
function App() {
  // console.log('appload', roomId)
  return (
    <StrictMode>
      <Provider>{isAuthenticated() ? <Client/> : <Auth />}</Provider>
    </StrictMode>
  );
}

export default App;
