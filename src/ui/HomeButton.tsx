// The one way back to the title page. Same label, same place (top left) on every screen and every
// screen size, so nobody has to guess whether the wordmark is clickable.
import { goHome } from "../state/router";

export default function HomeButton() {
  return (
    <button type="button" className="back home-button" onClick={goHome} title="Back to the Left Behind title page">
      <span aria-hidden>←</span> Home
    </button>
  );
}
