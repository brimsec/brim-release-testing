import {TabState} from "../Tab/types"

export type TabsState = {active: string; data: TabState[]}
export type TabActions =
  | TABS_ADD
  | TABS_REMOVE
  | TABS_ACTIVATE
  | TABS_MOVE
  | TABS_ORDER
  | TABS_ACTIVE_CLEAR

export type AddTabData = {
  connectionId: string | null
  spaceId: string | null
}

export type TABS_ADD = {
  type: "TABS_ADD"
  id: string
  data: AddTabData
}
export type TABS_REMOVE = {type: "TABS_REMOVE"; id: string}
export type TABS_ACTIVATE = {type: "TABS_ACTIVATE"; id: string}
export type TABS_MOVE = {type: "TABS_MOVE"; id: string; index: number}
export type TABS_ORDER = {type: "TABS_ORDER"; indices: number[]}
export type TABS_ACTIVE_CLEAR = {type: "TABS_ACTIVE_CLEAR"}
