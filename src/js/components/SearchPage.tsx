import {useDispatch, useSelector} from "react-redux"
import React, {useEffect} from "react"

import {LeftPane} from "./LeftPane"
import {XRightPane} from "./RightPane"
import Handlers from "../state/Handlers"
import StatusBar from "./StatusBar"
import TabBar from "./TabBar/TabBar"
import TabContent from "./TabContent"
import Tabs from "../state/Tabs"
import useSearchShortcuts from "./useSearchShortcuts"
import styled from "styled-components"

const ColumnLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: column;
  position: relative;
`

const RowLayout = styled.div`
  display: flex;
  overflow: hidden;
  flex-grow: 1;
  flex-flow: row;
  position: relative;
  box-shadow: inset 0px 1px 1px ${(props) => props.theme.colors.lead};
  padding-top: 1px;
`

const SearchPageMain = styled.div`
  display: flex;
  height: 100%;
`

const SearchPageWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: fadein 300ms;
`

export default function SearchPage() {
  const dispatch = useDispatch()
  const tabId = useSelector(Tabs.getActive)

  useSearchShortcuts()
  useEffect(() => () => dispatch(Handlers.abortAll()), [])

  return (
    <SearchPageWrapper>
      <SearchPageMain>
        <ColumnLayout>
          <TabBar />
          <RowLayout>
            <LeftPane />
            <ColumnLayout>
              <TabContent key={tabId} />
            </ColumnLayout>
            <XRightPane key={tabId} />
          </RowLayout>
          <StatusBar />
        </ColumnLayout>
      </SearchPageMain>
    </SearchPageWrapper>
  )
}
