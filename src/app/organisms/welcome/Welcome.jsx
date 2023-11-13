import React from 'react';
import './Welcome.scss';

import Text from '../../atoms/text/Text';

import CinnySvg from '../../../../public/res/svg/cinny.svg';
import MomentifyPng from '../../../../public/small-logo.png';

function Welcome() {
  return (
    <div className="app-welcome flex--center">
      <div>
        <img className="app-welcome__logo noselect" src={MomentifyPng} alt="Cinny logo" />
        <Text className="app-welcome__heading" variant="h1" weight="medium" primary>Welcome to Momentify Chat</Text>
        <Text className="app-welcome__subheading" variant="s1">Just a random text</Text>
      </div>
    </div>
  );
}

export default Welcome;
