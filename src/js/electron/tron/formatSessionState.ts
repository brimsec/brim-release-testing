import {GlobalState} from "../../state/globalReducer"
import {WindowState, WindowsState} from "./windowManager"

export type SessionState = {
  order: string[]
  windows: {
    [key: string]: {
      name: string
      position: [number, number]
      size: [number, number]
      state: Object
    }
  }
  globalState: GlobalState
}

export default function(
  windows: WindowsState,
  globalState: GlobalState
): SessionState {
  const groupById = (all, id) => ({
    ...all,
    [id]: getWindowData(windows[id])
  })

  const order = getWindowOrder(windows)

  return {
    order,
    windows: order.reduce(groupById, {}),
    globalState
  }
}

function getWindowOrder(windows: WindowsState): string[] {
  return Object.entries(windows) // $FlowFixMe
    .sort((a, b) => a[1].lastFocused - b[1].lastFocused)
    .map((e) => e[0])
}

function getWindowData({name, state, size, position}: WindowState) {
  return {name, state, size, position}
}
