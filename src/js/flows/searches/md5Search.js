/* @flow */
import type {Thunk} from "../../state/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "../../searches/programs"
import {parallelizeProcs} from "../../lib/Program"
import {search} from "../search/mod"
import Current from "../../state/Current"
import Tab from "../../state/Tab"

const id = "Md5"

export const md5Search = (md5: string): Thunk => (dispatch, getState) => {
  const spaceId = Current.getSpaceId(getState())
  if (!spaceId) return
  const [from, to] = Tab.getSpanAsDates(getState())
  const query = parallelizeProcs([
    filenameCorrelation(md5),
    md5Correlation(md5),
    rxHostsCorrelation(md5),
    txHostsCorrelation(md5)
  ])

  return dispatch(search({id, query, from, to, spaceId, target: "events"}))
}
