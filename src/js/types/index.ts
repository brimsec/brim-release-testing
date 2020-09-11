import {$Field} from "../brim"
import {SearchTarget} from "../state/SearchBar/types"
import {SpanArgs} from "../state/Search/types"
import {TimeUnit} from "../lib"
import AppError from "../models/AppError"
import Log from "../models/Log"
import {MenuItemConstructorOptions} from "electron"

export type Notification =
  | AppError
  | {
      type: string
      data: any
      key: string
    }

export type Column = {type: string; name: string}
export type Descriptor = Column[]
export type Descriptors = {
  [key: string]: Descriptor
}
export type Tuple = string[]
export type Tuples = Tuple[]
export type TupleSet = {descriptors: Descriptors; tuples: Tuples}

export type ViewerDimens = {
  rowHeight: number
  rowWidth: number | "auto"
  viewHeight: number
  viewWidth: number
  listHeight: number
  listWidth: number | "auto"
}

export type RowRenderer = (arg0: number, arg1: ViewerDimens) => any

export type HashCorrelation = {
  name: "hash" | "tx" | "rx" | "md5"
  data: {tuples: Tuple[]; descriptor: Descriptor}
}

export type UidCorrelation = {
  name: "uid"
  data: Tuple[]
}

export type BoomSearchStats = {
  updateTime: number
  startTime: number
  bytesMatched: number
  bytesRead: number
  tuplesMatched: number
  tuplesRead: number
}

export type Correlation = HashCorrelation | UidCorrelation
export type LogCorrelations = {
  uid?: Tuple[]
  md5?: {tuples: Tuple[]; descriptor: Descriptor}
  tx?: {tuples: Tuple[]; descriptor: Descriptor}
  rx?: {tuples: Tuple[]; descriptor: Descriptor}
}

export type RelatedLogs = {
  [key: string]: Log[]
}

export type RightClickBuilder = (
  arg0: $Field,
  arg1: Log,
  arg2: boolean
) => MenuItemConstructorOptions[]

export type Results = {
  tuples: Tuple[]
  descriptor: Descriptor
}

export type Interval = {
  number: number
  unit: LongTimeUnit
  roundingUnit: TimeUnit
}

export type LongTimeUnit =
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "month"

export type ScrollPosition = {
  x: number
  y: number
}

export type SearchRecord = {
  program: string
  pins: string[]
  spanArgs: SpanArgs
  spaceId: string
  spaceName: string
  scrollPos?: ScrollPosition
  target: SearchTarget
}
