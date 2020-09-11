import {Thunk} from "../state/types"
import {globalDispatch} from "../state/GlobalContext"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import {getZealot} from "./getZealot"

export default function refreshSpaceInfo(): Thunk {
  return () => (dispatch, getState) => {
    const zealot = dispatch(getZealot())
    const id = Current.getSpaceId(getState())

    return zealot.spaces.get(id).then((data: any) => {
      const id = Current.getConnectionId(getState())
      if (!id) return
      globalDispatch(Spaces.setDetail(id, data))
    })
  }
}
