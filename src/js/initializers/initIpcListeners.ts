import {ipcRenderer} from "electron"

import {Store} from "../state/types"
import Layout from "../state/Layout"
import Modal from "../state/Modal"
import SearchBar from "../state/SearchBar"
import Tabs from "../state/Tabs"
import getPersistable from "../state/getPersistable"
import initNewSearchTab from "./initNewSearchTab"

export default (store: Store) => {
  ipcRenderer.on("pinSearch", () => {
    store.dispatch(SearchBar.pinSearchBar())
  })

  ipcRenderer.on("focusSearchBar", () => {
    const el = document.getElementById("main-search-input")

    if (el) {
      el.focus()
      // @ts-ignore
      el.select()
    }
  })

  ipcRenderer.on("clearPins", () => {
    store.dispatch(SearchBar.removeAllSearchBarPins())
    store.dispatch(SearchBar.changeSearchBarInput(""))
  })

  ipcRenderer.on("toggleLeftSidebar", () => {
    store.dispatch(Layout.toggleLeftSidebar())
  })

  ipcRenderer.on("toggleRightSidebar", () => {
    store.dispatch(Layout.toggleRightSidebar())
  })

  ipcRenderer.on("resetState", () => {
    /* Will implement soon */
  })

  ipcRenderer.on("getState", (event, channel) => {
    ipcRenderer.send(channel, getPersistable(store.getState()))
  })

  ipcRenderer.on("getState", (event, channel) => {
    ipcRenderer.send(channel, getPersistable(store.getState()))
  })

  ipcRenderer.on("showPreferences", () => {
    store.dispatch(Modal.show("settings"))
  })

  ipcRenderer.on("showAbout", () => {
    store.dispatch(Modal.show("about"))
  })

  ipcRenderer.on("back", () => {
    store.dispatch(SearchBar.goBack())
  })

  ipcRenderer.on("forward", () => {
    store.dispatch(SearchBar.goForward())
  })

  ipcRenderer.on("closeTab", () => {
    store.dispatch(Tabs.closeActive())
  })

  ipcRenderer.on("windows:newSearchTab", (e, {params}) => {
    initNewSearchTab(store, params)
  })

  ipcRenderer.on("globalStore:dispatch", (e, {action}) =>
    store.dispatch(action)
  )
}
