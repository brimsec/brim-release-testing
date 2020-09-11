import {isEmpty} from "lodash"

type Props = {children: JSX.Element; empty: JSX.Element; array: any[]}

export default function EmptyCheck({
  children,
  array,
  empty
}: Props): JSX.Element {
  if (isEmpty(array)) {
    return empty
  } else {
    return children
  }
}
