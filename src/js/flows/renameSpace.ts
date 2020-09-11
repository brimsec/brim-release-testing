import {Thunk} from "../state/types"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import {getZealot} from "./getZealot"

export default (
  clusterId: string,
  spaceId: string,
  name: string
): Thunk<Promise<void>> => (dispatch, getState, {globalDispatch}) => {
  const state = getState()
  const zealot = dispatch(getZealot())
  const tabs = Tabs.getData(state)

  return zealot.spaces.update(spaceId, {name}).then(() => {
    globalDispatch(Spaces.rename(clusterId, spaceId, name))
    tabs.forEach((t) => {
      if (t.current.spaceId === spaceId)
        dispatch(Current.setSpaceId(spaceId, t.id))
    })
  })
}
