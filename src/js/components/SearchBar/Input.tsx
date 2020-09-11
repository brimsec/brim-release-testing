import {useDispatch, useSelector} from "react-redux"
import React, {useRef} from "react"
import styled from "styled-components"

import {cssVar} from "../../lib/cssVar"
import {reactElementProps} from "../../test/integration"
import {submitSearch} from "../../flows/submitSearch/mod"
import InputHistory from "../../models/InputHistory"
import SearchBar from "../../state/SearchBar"

const StyledInput = styled.input`
  display: block;
  outline: none;
  border: none;
  padding: 0 8px 0 12px;
  font-family: ${cssVar("--mono-font")};
  height: 28px;
  line-height: 28px;
  font-size: 12px;
  letter-spacing: 0px;
  width: 100%;
  background: transparent;

  &:focus {
    outline: none;
  }
`

export default function Input() {
  const dispatch = useDispatch()
  const history = useRef(new InputHistory<string>())
  const inputValue = useSelector(SearchBar.getSearchBarInputValue)

  function changeTo(value: string) {
    dispatch(SearchBar.changeSearchBarInput(value))
  }

  function submit() {
    dispatch(submitSearch())
  }

  function onChange(e) {
    changeTo(e.currentTarget.value)
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      submit()
      history.current.push(e.currentTarget.value)
    }
    if (e.key === "ArrowUp") {
      history.current.goBack()
      changeTo(history.current.getCurrentEntry())
    }
    if (e.key === "ArrowDown") {
      history.current.goForward()
      changeTo(history.current.getCurrentEntry())
    }
  }

  return (
    <StyledInput
      id="main-search-input"
      className="mousetrap"
      type="text"
      value={inputValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      spellCheck={false}
      autoFocus={true}
      autoComplete="off"
      {...reactElementProps("search_input")}
    />
  )
}
