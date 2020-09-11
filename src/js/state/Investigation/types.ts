import {SearchRecord} from "../../types"
import {Ts} from "../../brim"
import Log from "../../models/Log"

export type InvestigationState = Finding[]
export type InvestigationAction =
  | FINDING_UPDATE
  | FINDING_DELETE
  | INVESTIGATION_CLEAR
  | INVESTIGATION_PUSH

export type Finding = {
  ts: Ts
  search: SearchRecord
  resultCount?: number
  note?: string
  logs?: Log[]
}

export type FINDING_UPDATE = {type: "FINDING_UPDATE"; finding: Partial<Finding>}
export type FINDING_DELETE = {type: "FINDING_DELETE"; ts: Ts[]}
export type INVESTIGATION_CLEAR = {type: "INVESTIGATION_CLEAR"}
export type INVESTIGATION_PUSH = {
  type: "INVESTIGATION_PUSH"
  entry: SearchRecord
  ts: Ts
}
