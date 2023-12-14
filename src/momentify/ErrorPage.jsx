import BackButton from "./BackButton";
import PropTypes from "prop-types";
import theme from './theme'

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

const SuisseSpan = {
	"fontFamily": theme.fontStyles.suisse,
	"fontSize": theme.fontSizes.mobile.body,
	"color": "white",
	"lineHeight": theme.lineHeight.body,
};

const BackButtonContainer = {
  "position": "absolute",
  "top": "16px",
  "left": "16px"
};

export default function ErrorPage({ errorMessage }) {
  return (
    <section style={{...Section}}>
      <div style={{...BackButtonContainer}}>
        <BackButton />
      </div>
      <span style={{...SuisseSpan}} data-id="error-page-message">
        {errorMessage}
      </span>
    </section>
  );
}

ErrorPage.propTypes = {
  errorMessage: PropTypes.string,
};

