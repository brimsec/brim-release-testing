import {
  AddTabData,
  TABS_ACTIVATE,
  TABS_ACTIVE_CLEAR,
  TABS_ADD,
  TABS_MOVE,
  TABS_ORDER,
  TABS_REMOVE
} from "./types"

export default {
  add: (id: string, data?: AddTabData): TABS_ADD => ({
    type: "TABS_ADD",
    id,
    data
  }),
  remove: (id: string): TABS_REMOVE => ({
    type: "TABS_REMOVE",
    id
  }),
  activate: (id: string): TABS_ACTIVATE => ({
    type: "TABS_ACTIVATE",
    id
  }),
  move: (id: string, index: number): TABS_MOVE => ({
    type: "TABS_MOVE",
    id,
    index
  }),
  order: (indices: number[]): TABS_ORDER => ({
    type: "TABS_ORDER",
    indices
  }),
  clearActive: (): TABS_ACTIVE_CLEAR => ({
    type: "TABS_ACTIVE_CLEAR"
  })
}
