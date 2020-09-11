import {basename} from "path"

import appStep from "../lib/appStep/api"
import newAppInstance from "../lib/newAppInstance"
import {retryUntil} from "../lib/control"
import {handleError, stdTest} from "../lib/jest"
import {dataSets} from "../lib/data"
import {selectors} from "../../src/js/test/integration"
import {LOG} from "../lib/log"

const verifySingleRectAttr = (app, pathClass, attr) =>
  // We needn't wait on this selector: the stack has verifyPathClassRect()
  // calling this after a retryUntil() succeeds in which the number of distinct
  // _path g classes are present.
  app.client.getAttribute(`.${pathClass} rect`, attr).then((vals) => {
    // Handle case of a single rect, in which case webdriver doesn't return an
    // array of 1 item but instead a scalar
    if (typeof vals === "string") {
      vals = [vals]
    }
    if (!Array.isArray(vals)) {
      throw new Error(
        `expected Array for ${pathClass} attr ${attr}; got ${vals}`
      )
    }
    vals.forEach((val) => {
      expect(Number(val)).toBeGreaterThanOrEqual(
        dataSets.sample.histogram.rectAttrMin
      )
      expect(Number(val)).toBeLessThan(dataSets.sample.histogram.rectAttrMax)
    })
    return vals
  })

const verifyPathClassRect = (app, pathClass) =>
  Promise.all(
    ["x", "y", "width", "height"].map((attr) =>
      verifySingleRectAttr(app, pathClass, attr)
    )
  )

describe("Histogram tests", () => {
  let app
  let testIdx = 0
  beforeEach(async (done) => {
    app = newAppInstance(basename(__filename), ++testIdx)
    await appStep.startApp(app)
    done()
  })

  afterEach(async (done) => {
    if (app && app.isRunning()) {
      await app.stop()
    }
    done()
  })

  stdTest("histogram deep inspection", (done) => {
    // This is a data-sensitive test that assumes the histogram has particular
    // data loaded. There are inline comments that explain the test's flow.
    LOG.debug("Pre-login")
    appStep
      .ingestFile(app, "sample.pcap")
      .then(async () => {
        LOG.debug("Checking a histogram appears")
        // Verify that a histogram of at least *partial data* is
        // present.
        await retryUntil(
          () => app.client.$$(selectors.histogram.rectElem),
          (rectElements) => rectElements.length > 0
        ).catch(() => {
          throw new Error("Initial histogram did not render any rect elements")
        })
        LOG.debug("Got number of histogram rect elements")
        // Assuming we properly loaded data into a default space, we
        // we must wait until the components of the histogram are rendered. This
        // means we must wait for a number of g elements and rect elements. Those
        // elements depend on both the dataset itself and the product's behavior.
        // Set to "Whole Space" to make sure this entire histogram is redrawn.
        await appStep.setSpan(app, "Whole Space")
        // Just count a higher number of _paths, not all ~1500 rect elements.
        LOG.debug("Checking rect elements in Whole Space")
        const pathClasses = await retryUntil(
          () => app.client.getAttribute(selectors.histogram.gElem, "class"),
          (pathClasses) =>
            pathClasses.length ===
            dataSets.sample.histogram.wholeSpaceDistinctPaths
        )
        LOG.debug("Got number of distinct _paths")
        expect(pathClasses.sort()).toMatchSnapshot()
        // Here is the meat of the test verification. Here we fetch all 4
        // attributes' values of all rect elements, in a 2-D array of _path and
        // attribute. We ensure all the values are positive in a REASONABLE
        // range. We do NOT validate absolutely correct attribute values (which
        // sets the size of a bar). That's best done with unit testing.
        LOG.debug("Getting all rect elements")
        const allRectValues = await Promise.all(
          pathClasses.map(
            async (pathClass) => await verifyPathClassRect(app, pathClass)
          )
        )
        LOG.debug("Got all rect elements")
        expect(allRectValues.length).toBe(
          // Whereas we just counted g elements before, this breaks down rect
          // elements within their g parent, ensuring rect elements are of the
          // proper _path.
          dataSets.sample.histogram.wholeSpaceDistinctPaths
        )
        LOG.debug("Ensuring all rect elements' attributes are sane")
        allRectValues.forEach((pathClass: string[]) => {
          // The 4 comes from each of x, y, width, height for a rect element.
          expect(pathClass.length).toBe(4)
          pathClass.forEach((attr) => {
            expect(attr.length).toBe(
              dataSets.sample.histogram.wholeSpaceRectsPerClass
            )
          })
        })
        LOG.debug("Ensured all rect elements' attributes are sane")
        done()
      })
      .catch((err) => {
        handleError(app, err, done)
      })
  })
})
