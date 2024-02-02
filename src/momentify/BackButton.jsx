import { Icon, IconButton, Icons } from "folds";
import LeftArrow from "../../public/res/svg/left-arrow.svg"
import initMatrix from "../client/initMatrix";
import BackArrowIC from '../../public/res/ic/outlined/chevron-left.svg';

const Button = {
	display: "flex",
	padding: "4px",
	justifyContent: "center",
	textAlign: "center",
	borderRadius: "10px",
	border: "1px solid rgba(255, 255, 255, 0.15)",
};

export default function BackButton({className, ...props}) {
  const handleOnClick = () => {
    window.history.go(-1);
    initMatrix.stopClient();
  }

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

    <IconButton className={className} variant="Surface" size="300" onClick={handleOnClick} style={{...Button}} {...props}>
      <Icon src={Icons.ArrowLeft} />
    </IconButton>
  )
}