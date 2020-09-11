import {useDispatch} from "react-redux"
import React, {useState} from "react"
import styled from "styled-components"

import {ipcRenderer} from "electron"

import {toolbarExportButton} from "../../test/locators"
import ExportIcon from "../../icons/ExportIcon"
import InfoNotice from "../InfoNotice"
import Label from "./Label"
import MacSpinner from "../MacSpinner"
import ToolbarButton from "./Button"
import XButton from "../XButton"
import exportResults from "../../flows/exportResults"
import useIpcListener from "../hooks/useIpcListener"
import useSetTimeout from "../hooks/useSetTimeout"

const SpinnerWrap = styled.div`
  transform: scale(0.8);
  margin-right: 12px;
`

const ExportingMessage = () => (
  <>
    <p>Exporting...</p>
    <SpinnerWrap>
      <MacSpinner light />
    </SpinnerWrap>
  </>
)

const DoneMessage = ({onClick}) => (
  <>
    <p>Export complete.</p>
    <XButton onClick={onClick} />
  </>
)

function showDialog() {
  return ipcRenderer.invoke("windows:showSaveDialog", {
    title: "Export Results as ZNG",
    buttonLabel: "Export",
    defaultPath: "results.zng",
    properties: ["createDirectory"]
  })
}

export default function ExportButton() {
  const dispatch = useDispatch()
  const [status, setStatus] = useState("INIT")
  const setTimeout = useSetTimeout()

  useIpcListener("exportResults", onClick, [])

  function dismiss() {
    setStatus("INIT")
  }

  async function onClick() {
    const {canceled, filePath} = await showDialog()
    if (canceled) return
    setStatus("EXPORTING")
    await dispatch(exportResults(filePath))
    setStatus("DONE")
    setTimeout(dismiss, 3000)
  }

  const messages = {
    INIT: null,
    EXPORTING: <ExportingMessage />,
    DONE: <DoneMessage onClick={dismiss} />
  }

  return (
    <div title="Export search results to ZNG file">
      <ToolbarButton
        {...toolbarExportButton.props}
        icon={<ExportIcon />}
        onClick={onClick}
      />
      <Label>Export</Label>

      {status !== "INIT" && <InfoNotice>{messages[status]}</InfoNotice>}
    </div>
  )
}
