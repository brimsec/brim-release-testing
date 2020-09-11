// This is needed to use zealot outside a browser.
global.fetch = require("node-fetch")

import {execSync} from "child_process"
import path from "path"

import {createZealot} from "zealot"

import {retryUntil} from "../lib/control"
import {nodeZqDistDir} from "../lib/env"
import {handleError, stdTest} from "../lib/jest"
import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/newAppInstance"

describe("Zar tests", () => {
  let app
  let testIdx = 0
  const ZAR = path.join(nodeZqDistDir(), "zar")
  const ZAR_SPACE_NAME = "sample.zar"
  beforeEach(() => {
    app = newAppInstance(path.basename(__filename), ++testIdx)
    return appStep.startApp(app)
  })

  afterEach(async () => {
    if (app && app.isRunning()) {
      return await app.stop()
    }
  })

  stdTest(`Brim starts when a Zar space is present`, (done) => {
    appStep
      .ingestFile(app, "sample.tsv")
      .then(async () => {
        // Use zealot to
        // 1. Create a new space
        // 2. Find the path to sample.tsv.brim's all.zng
        const client = createZealot("localhost:9867")

        const sampleSpace = (await client.spaces.list())[0]
        const zarSpace = await client.spaces.create({name: ZAR_SPACE_NAME})

        const zngFile = sampleSpace.data_path + "/all.zng"
        const zarRoot = zarSpace.data_path

        // Create a zar archive inside the space.
        execSync(`"${ZAR}" import -s 1024B -R "${zarRoot}" "${zngFile}"`)

        // Make sure zqd identifies both spaces.
        retryUntil(
          () => client.spaces.list(),
          (spaces) => spaces.length === 2
        )

        // Reload the app so that it reads the new space.
        await appStep.reload(app)
        await appStep.click(app, ".add-tab")
        await app.client.waitForVisible(`=${ZAR_SPACE_NAME}`)
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
