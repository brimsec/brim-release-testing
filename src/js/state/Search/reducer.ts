import {SearchActions, SearchState} from "./types"

export const initSearchState: SearchState = {
  span: [
    {sec: 0, ns: 0},
    {sec: 1, ns: 0}
  ],
  spanArgs: ["now - 5m", "now"],
  spanFocus: null
}

export default function reducer(
  state: SearchState = initSearchState,
  action: SearchActions
) {
  switch (action.type) {
    case "SEARCH_SPAN_SET":
      return {...state, span: action.span}
    case "SEARCH_SPAN_ARGS_SET":
      return {...state, spanArgs: action.spanArgs}
    case "SEARCH_SPAN_FOCUS_SET":
      return {...state, spanFocus: action.spanFocus}
    case "SEARCH_CLEAR":
      return {...initSearchState}
    default:
      return state
  }
}
