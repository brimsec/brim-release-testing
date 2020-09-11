import getTestState from "../../test/helpers/getTestState"
import migrate from "./202008271352_addTargetToSearchRecord"

test("migrating 202008271352_addTargetToSearchRecord", () => {
  const {data} = getTestState("v0.15.1")

  const next = migrate(data)

  // @ts-ignore
  for (const {state} of Object.values(next.windows)) {
    state.investigation.forEach((finding) => {
      expect(finding.search.target).toBe("events")
    })

    state.tabs.data.forEach((t) => {
      t.history.entries.forEach((e) => {
        expect(e.target).toBe("events")
      })
    })
  }
})
