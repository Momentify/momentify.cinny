import React from 'react';
import './LoadingRoom.scss';

import { LoadingScreen } from '../../templates/auth/Auth';

function LoadingRoom() {

  // React.useEffect(() => {
    // Set Timeout to show reload button after 3 seconds
    // const timeout = setTimeout(() => window.location.reload(), 3000);
    // return () => clearTimeout(timeout);
  // }
  // , []);

  return (
    <div className="app-welcome flex--center">
      <LoadingScreen message='Please wait while we set up the chat room...' />
    </div>
  );
}

export default LoadingRoom;
