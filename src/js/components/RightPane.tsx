import {connect} from "react-redux"
import React from "react"

import {DispatchProps} from "../state/types"
import {Space} from "../state/Spaces/types"
import {XRightPaneExpander} from "./RightPaneExpander"
import {openLogDetailsWindow} from "../flows/openLogDetailsWindow"
import CloseButton from "./CloseButton"
import Current from "../state/Current"
import ExpandWindow from "../icons/ExpandWindow"
import HistoryButtons from "./common/HistoryButtons"
import Layout from "../state/Layout"
import Log from "../models/Log"
import LogDetails from "../state/LogDetails"
import LogDetailsComponent from "./LogDetails"
import Pane, {
  PaneHeader,
  PaneTitle,
  Left,
  Right,
  Center,
  PaneBody
} from "./Pane"
import dispatchToProps from "../lib/dispatchToProps"

type StateProps = {
  currentLog: Log
  prevExists: boolean
  nextExists: boolean
  isOpen: boolean
  width: number
  space: Space
}

type Props = StateProps & DispatchProps

type S = {
  showCollapse: boolean
}

export default class RightPane extends React.Component<Props, S> {
  state = {showCollapse: true}

  onDrag = (e: MouseEvent) => {
    const width = window.innerWidth - e.clientX
    const max = window.innerWidth
    this.props.dispatch(Layout.setRightSidebarWidth(Math.min(width, max)))
  }

  render() {
    const {prevExists, nextExists, isOpen, width, currentLog} = this.props
    if (!this.props.space) return null
    if (!isOpen) return <XRightPaneExpander />
    return (
      <Pane
        isOpen={isOpen}
        onDrag={this.onDrag}
        position="right"
        width={width}
        className="log-detail-pane"
      >
        {currentLog && (
          <PaneHeader>
            <Left>
              <HistoryButtons
                prevExists={prevExists}
                nextExists={nextExists}
                backFunc={() => this.props.dispatch(LogDetails.back())}
                forwardFunc={() => this.props.dispatch(LogDetails.forward())}
              />
            </Left>
            <Center className="log-detail-center">
              <PaneTitle>Log Details</PaneTitle>
              <ExpandWindow
                onClick={() => this.props.dispatch(openLogDetailsWindow())}
                className="panel-button"
              />
            </Center>
            <Right>
              <CloseButton
                className="panel-button close-button"
                onClick={() => this.props.dispatch(Layout.hideRightSidebar())}
              />
            </Right>
          </PaneHeader>
        )}
        <PaneBody>
          <LogDetailsComponent />
        </PaneBody>
      </Pane>
    )
  }
}

const stateToProps = (state) => {
  return {
    isOpen: Layout.getRightSidebarIsOpen(state),
    width: Layout.getRightSidebarWidth(state),
    prevExists: LogDetails.getHistory(state).prevExists(),
    nextExists: LogDetails.getHistory(state).nextExists(),
    currentLog: LogDetails.build(state),
    space: Current.getSpace(state)
  }
}

export const XRightPane = connect(stateToProps, dispatchToProps)(RightPane)
