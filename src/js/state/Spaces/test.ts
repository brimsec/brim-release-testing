import Spaces from "./"
import initTestStore from "../../test/initTestStore"
import {Space} from "./types"

let store
beforeEach(() => {
  store = initTestStore()
})

const detail = {
  id: "defaultId",
  name: "defaultName",
  span: {
    ts: {sec: 1425564900, ns: 0},
    dur: {sec: 3352893, ns: 750000000}
  },
  pcap_support: true
}

const testSpace1: Space = {
  id: "testId1",
  name: "testName1",
  max_time: {ns: 0, sec: 0},
  min_time: {ns: 0, sec: 0},
  pcap_support: false,
  storage_kind: "filestore",
  size: 99,
  ingest: {
    progress: null,
    warnings: [],
    snapshot: null
  }
}

const testSpace2: Space = {
  id: "testId2",
  name: "testName2",
  max_time: {ns: 0, sec: 0},
  min_time: {ns: 0, sec: 0},
  pcap_support: false,
  storage_kind: "filestore",
  size: 99,
  ingest: {
    progress: null,
    warnings: [],
    snapshot: null
  }
}

const testSpaces: Space[] = [testSpace1, testSpace2]

test("setting the spaces", () => {
  const state = store.dispatchAll([Spaces.setSpaces("cluster1", testSpaces)])

  expect(Spaces.ids("cluster1")(state)).toEqual(["testId1", "testId2"])
})

test("space names removing", () => {
  const selector = Spaces.ids("cluster1")
  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", testSpaces),
    Spaces.setSpaces("cluster1", [testSpace2])
  ])

  expect(selector(state)).toEqual(["testId2"])
})

test("setting the space detail adds the defaults", () => {
  const state = store.dispatchAll([Spaces.setDetail("cluster1", detail)])

  expect(Spaces.get("cluster1", "defaultId")(state)).toEqual({
    name: "defaultName",
    id: "defaultId",
    pcap_support: true,
    min_time: {sec: 1425564900, ns: 0},
    max_time: {sec: 1428917793, ns: 750000000},
    ingest: {
      progress: null,
      warnings: [],
      snapshot: null
    }
  })
})

test("setting the ingest progress throws error if no space yet", () => {
  expect(() => {
    store.dispatchAll([Spaces.setIngestProgress("cluster1", detail.id, 0.5)])
  }).toThrow("No space exists with id: defaultId")
})

test("setting the ingest progress", () => {
  const actions = Spaces.actionsFor("cluster1", testSpace1.id)
  store.dispatchAll([
    Spaces.setSpaces("cluster1", testSpaces),
    actions.setIngestProgress(0.5)
  ])

  const value = Spaces.getIngestProgress(
    "cluster1",
    testSpace1.id
  )(store.getState())

  expect(value).toEqual(0.5)
})

test("getting the spaces with details, others not", () => {
  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", testSpaces),
    Spaces.setDetail("cluster1", {...detail})
  ])
  const spaces = Spaces.getSpaces("cluster1")(state)

  expect(spaces).toEqual([
    {...testSpace1, ingest: {warnings: [], progress: null, snapshot: null}},
    {...testSpace2, ingest: {warnings: [], progress: null, snapshot: null}},
    {
      name: "defaultName",
      id: "defaultId",
      max_time: {ns: 750000000, sec: 1428917793},
      min_time: {ns: 0, sec: 1425564900},
      pcap_support: true,
      ingest: {warnings: [], progress: null, snapshot: null}
    }
  ])
})

test("only cares about spaces actions", () => {
  store.dispatch({type: "NON_SPACE"})
  expect(Spaces.raw(store.getState())).toEqual({})
})

test("ingest warnings", () => {
  const actions = Spaces.actionsFor("cluster1", testSpace1.id)
  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", [testSpace1]),
    actions.appendIngestWarning("Problem 1"),
    actions.appendIngestWarning("Problem 2")
  ])

  expect(Spaces.getIngestWarnings("cluster1", testSpace1.id)(state)).toEqual([
    "Problem 1",
    "Problem 2"
  ])
})

test("clear warnings", () => {
  const actions = Spaces.actionsFor("cluster1", testSpace1.id)
  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", [testSpace1]),
    actions.appendIngestWarning("Problem 1"),
    actions.appendIngestWarning("Problem 2"),
    actions.clearIngestWarnings()
  ])

  expect(Spaces.getIngestWarnings("cluster1", testSpace1.id)(state)).toEqual([])
})

test("remove space", () => {
  const actions = Spaces.actionsFor("cluster1", testSpace1.id)

  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", [testSpace1]),
    actions.remove()
  ])

  expect(Spaces.getSpaces("cluster1")(state)).toEqual([])
})

test("setting the spanshot counter", () => {
  const actions = Spaces.actionsFor("cluster1", testSpace1.id)

  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", [testSpace1]),
    actions.setIngestSnapshot(1)
  ])

  expect(Spaces.getIngestSnapshot("cluster1", testSpace1.id)(state)).toBe(1)
})

test("rename a space", () => {
  const testRename = "renamed test space"

  const state = store.dispatchAll([
    Spaces.setSpaces("cluster1", [testSpace1]),
    Spaces.rename("cluster1", testSpace1.id, testRename)
  ])

  expect(Spaces.get("cluster1", testSpace1.id)(state).name).toEqual(testRename)
})
