import React from "react"

import {RowRenderer, ViewerDimens} from "../../types"
import Log from "../../models/Log"
import * as Styler from "./Styler"
import TableColumns from "../../models/TableColumns"

type Props = {
  rowRenderer: RowRenderer
  columns: TableColumns
  dimens: ViewerDimens
  rows: number[]
  logs: Log[]
}

export default class Chunk extends React.Component<Props> {
  render() {
    const {rowRenderer, dimens, rows} = this.props
    return (
      <div className="chunk" style={Styler.chunk(dimens, rows[0], rows.length)}>
        {rows.map((index) => rowRenderer(index, dimens))}
      </div>
    )
  }
}
