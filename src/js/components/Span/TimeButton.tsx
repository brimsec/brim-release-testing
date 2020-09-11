import {isEqual} from "lodash"
import * as React from "react"
import {useEffect, useState} from "react"
import classNames from "classnames"

import {TimeArg} from "../../state/Search/types"
import {isString} from "../../lib/is"
import Animate from "../Animate"
import MenuBarButton from "../MenuBarButton"
import TimeInput from "./TimeInput"
import TimePiece from "./TimePiece"
import TimeSteppers from "./TimeSteppers"
import brim, {Ts} from "../../brim"
import useFuzzyHover from "../hooks/useFuzzyHover"
import {TimeUnit} from "src/js/lib"

type Props = {
  timeArg: TimeArg
  prevTimeArg: TimeArg | null | undefined
  onChange: Function
  icon?: React.ReactNode
}

export default function TimeButton({
  timeArg,
  prevTimeArg,
  onChange,
  icon
}: Props) {
  const [[x, y], setPosition] = useState([0, 0])
  const [unit, setUnit] = useState<TimeUnit>("month")
  const [editing, setEditing] = useState(false)
  const fuzzy = useFuzzyHover(0, 150)
  const dirty = !!prevTimeArg && !isEqual(timeArg, prevTimeArg)

  useEffect(() => {
    if (editing === false) fuzzy.mouseLeave()
  }, [editing])

  function updatePosition(e) {
    fuzzy.mouseEnter()
    const {width, x, y} = e.currentTarget.getBoundingClientRect()
    const stepperWidth = 20
    const centeredX = x + width / 2 - stepperWidth / 2
    setUnit(e.currentTarget.dataset.unit)
    setPosition([centeredX, y])
  }

  function onUp(e) {
    e.stopPropagation()
    if (isString(timeArg)) return
    onChange(
      brim
        .time(timeArg)
        .add(1, unit)
        .toTs()
    )
  }

  function onDown(e) {
    e.stopPropagation()
    if (isString(timeArg)) return
    onChange(
      brim
        .time(timeArg)
        .subtract(1, unit)
        .toTs()
    )
  }

  function onClick() {
    setEditing(true)
    fuzzy.mouseLeave()
  }

  function onSubmit(date) {
    onChange(date)
    setEditing(false)
  }

  function reset(e) {
    e.stopPropagation()
    if (prevTimeArg) {
      onChange(prevTimeArg)
    }
  }

  if (editing) return <TimeInput timeArg={timeArg} onSubmit={onSubmit} />
  return (
    <div
      className={classNames("time-picker-button", {
        hovering: fuzzy.hovering
      })}
      onMouseLeave={fuzzy.mouseLeave}
      onClick={onClick}
    >
      <div className="hover-zone" />
      <TimeSteppers
        show={fuzzy.hovering}
        onUp={onUp}
        onDown={onDown}
        style={{transform: `translate(${x}px, ${y}px)`}}
      />
      <MenuBarButton onFocus={() => setEditing(true)} icon={icon}>
        {isString(timeArg) ? (
          brim.relTime(timeArg).format()
        ) : (
          <TimeDisplay ts={timeArg} onMouseEnter={updatePosition} />
        )}
      </MenuBarButton>
      <ChangedDot show={dirty} onClick={reset} />
    </div>
  )
}

function ChangedDot({show, onClick}) {
  const enter = {scale: [0, 1]}
  return (
    <Animate show={show} enter={enter}>
      <div className="changed-dot" onClick={onClick} />
    </Animate>
  )
}

type TDProps = {ts: Ts; onMouseEnter: (e: React.MouseEvent) => void}
function TimeDisplay({ts, onMouseEnter}: TDProps) {
  const t = brim.time(ts)
  return (
    <>
      <TimePiece data-unit="month" onMouseEnter={onMouseEnter}>
        {t.format("MMM")}
      </TimePiece>
      <TimePiece data-unit="day" onMouseEnter={onMouseEnter}>
        {t.format("DD")}
      </TimePiece>
      ,
      <TimePiece data-unit="year" onMouseEnter={onMouseEnter}>
        {t.format("YYYY")}
      </TimePiece>
      <TimePiece data-unit="hour" onMouseEnter={onMouseEnter}>
        {t.format("HH")}
      </TimePiece>
      :
      <TimePiece data-unit="minute" onMouseEnter={onMouseEnter}>
        {t.format("mm")}
      </TimePiece>
      :
      <TimePiece data-unit="second" onMouseEnter={onMouseEnter}>
        {t.format("ss")}
      </TimePiece>
    </>
  )
}
