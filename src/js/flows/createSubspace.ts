import {Thunk} from "../state/types"
import {createSpaceName} from "../brim/spaceName"
import {getUniqName} from "../lib/uniqName"
import {getZealot} from "./getZealot"
import Current from "../state/Current"
import Spaces from "../state/Spaces"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import refreshSpaceNames from "./refreshSpaceNames"

class CreateSubspaceError extends Error {}

export default (): Thunk<Promise<void>> => (dispatch, getState) => {
  const zealot = dispatch(getZealot())
  const spaceId = Current.getSpaceId(getState())
  const connectionId = Current.getConnectionId(getState())
  const names = Spaces.getSpaces(connectionId)(getState()).map((s) => s.name)
  const records = Viewer.getSelectedRecords(getState()).map(brim.record)
  if (!records.length)
    return Promise.reject(new CreateSubspaceError("No selected logs"))

  try {
    const logs = records.map((r) => r.mustGet("_log").stringValue())
    const keys = records.map((r) => r.mustGet("key").stringValue())
    const name = getUniqName(createSpaceName(keys[0]), names)
    return zealot.subspaces
      .create({name, spaceId, logs})
      .then((space) =>
        dispatch(refreshSpaceNames()).then(() => dispatch(Tabs.new(space.id)))
      )
  } catch (e) {
    return Promise.reject(new CreateSubspaceError(e.message))
  }
}
