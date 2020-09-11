import {DateTuple} from "../lib/TimeWindow"
import brim, {Span} from "./"

export default function dateTuple(dt: DateTuple) {
  return {
    toSpan(): Span {
      return [brim.time(dt[0]).toTs(), brim.time(dt[1]).toTs()]
    }
  }
}
