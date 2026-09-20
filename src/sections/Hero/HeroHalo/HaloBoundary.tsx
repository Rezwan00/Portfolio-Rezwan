import { Component } from 'react'
import type { ReactNode } from 'react'

/** A chunk/render failure must never remove the existing DOM artwork. */
export class HaloBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { this.props.onFailure() }
  render() { return this.state.failed ? null : this.props.children }
}
