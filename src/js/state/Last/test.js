/* @flow */
import Last from "./"
import initTestStore from "../../test/initTestStore"

let store, select, dispatch

beforeEach(() => {
  store = initTestStore()
  select = (s) => s(store.getState())
  dispatch = store.dispatch
})

test("initial state is null", () => {
  expect(select(Last.getSearch)).toBe(null)
})

test("set to a search record", () => {
  const search = {
    program: "conn",
    pins: [],
    spaceId: "1",
    spaceName: "things",
    spanArgs: ["now", "now"],
    target: "events"
  }
  dispatch(Last.setSearch(search))

  expect(select(Last.getSearch)).toEqual(search)
})
