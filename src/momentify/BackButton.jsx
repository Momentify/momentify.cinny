/* eslint-disable react/react-in-jsx-scope */
import { Icon, IconButton, Icons } from 'folds';
import LeftArrow from '../../public/res/svg/left-arrow.svg';
import initMatrix from '../client/initMatrix';
import BackArrowIC from '../../public/res/ic/outlined/chevron-left.svg';
import BackIcon from '../../public/BackIcon.svg';

const Button = {
  display: 'flex',
  padding: '4px',
  justifyContent: 'center',
  textAlign: 'center',
  borderRadius: '10px',
  backgroudnColor: 'none !important',
};

export default function BackButton({ className, ...props }) {
  const handleOnClick = () => {
    window.history.go(-1);
    initMatrix.stopClient();
  };

  return (
    // <button style={{...Button}} onClick={handleOnClick}>
    //     <img src="../../public/res/svg/left-arrow.svg" />
    // </button>
    //  <IconButton
    //  src={BackArrowIC}
    //  tooltip="Return to previous page"
    //  onClick={handleOnClick}
    //  style={{...Button}}
    // />

    // eslint-disable-next-line react/react-in-jsx-scope
    <IconButton
      className={className}
      variant="Surface"
      size="300"
      onClick={handleOnClick}
      style={{ ...Button }}
      {...props}
    >
      <img
        alt="back"
        style={{
          height: '14px',
        }}
        src={BackIcon}
      />
    </IconButton>
  );
}
