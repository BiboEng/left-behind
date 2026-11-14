// Catches a crash in one part of the page (e.g. a 3D model that fails to load) and shows a
// fallback there, instead of the whole app going blank.
import { Component, type ReactNode } from "react";

interface Props {
  fallback: ReactNode;
  children: ReactNode;
}

export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[Left Behind] section failed to render:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
