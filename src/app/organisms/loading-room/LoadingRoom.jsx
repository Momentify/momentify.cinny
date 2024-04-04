import React from 'react';
import './LoadingRoom.scss';

import { LoadingScreen } from '../../templates/auth/Auth';
import BackButton from '../../../momentify/BackButton';
import theme from '../../../momentify/theme';

const BackButtonContainer = {
  "position": "absolute",
  "top": "16px",
  "left": "16px"
};

const Section = {
  "background": theme.colors.backgroundOverlay,
	"backgroundColor": "rgba(17, 17, 31, 1)",
	"backgroundBlendMode": "multiply",
	"color": theme.colors.softWhite,
	"flex": 1,
  "display": "flex",
  "flexDdirection": "column",
  "alignItems": "center",
  "justifyContent": "center",
  "textAlign": "center",
  "padding": "1rem",
  "gap": "20px",
  "position": "relative",
  "height": "100%"
};

function LoadingRoom() {

  // React.useEffect(() => {
    // Set Timeout to show reload button after 3 seconds
    // const timeout = setTimeout(() => window.location.reload(), 3000);
    // return () => clearTimeout(timeout);
  // }
  // , []);

  return (
      <section style={{...Section}}>    
        <div style={{...BackButtonContainer}}>
          <BackButton />
        </div>
        <LoadingScreen message='Please wait while we set up the chat room...' />
      </section>
  );
}

export default LoadingRoom;
