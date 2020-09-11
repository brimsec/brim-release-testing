import {Thunk} from "../state/types"
import Current from "../state/Current"
import refreshSpaceNames from "./refreshSpaceNames"
import {getZealot} from "./getZealot"

type Props = {
  name: string
  kind: string
  data_path: string
}

export const createSpace = ({
  name,
  kind,
  data_path
}: Props): Thunk<Promise<void>> => async (dispatch) => {
  const zealot = dispatch(getZealot())
  return zealot.spaces
    .create({
      name,
      storage: {kind},
      data_path: data_path.length ? data_path : undefined
    })
    .then((space) =>
      dispatch(refreshSpaceNames()).then(() =>
        dispatch(Current.setSpaceId(space.id))
      )
    )
}
