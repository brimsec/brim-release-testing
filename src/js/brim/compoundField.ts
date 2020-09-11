import {FieldValue} from "../types/records"
import {ONE_CHAR} from "./field"
import {isArray} from "../lib/is"
import brim from "./"

export const COMPOUND_FIELD_RGX = /^(set|array)\[(\w+)\]$/

function compoundField(
  name: string,
  type: string,
  value: FieldValue[] | null | undefined
) {
  const match = type.match(COMPOUND_FIELD_RGX)
  if (!match) throw new Error("Not compound type: " + type)
  const [_, container, itemType] = match
  let items = []
  if (isArray(value)) items = value

  return {
    name,
    container,
    itemType,
    length: items.length,
    items() {
      return items.map((_, index) => this.item(index))
    },
    item(index: number) {
      if (items[index]) {
        return brim.field({name, type: itemType, value: items[index]})
      } else {
        return null
      }
    },
    guessWidth() {
      const comma = ONE_CHAR
      const wrap = 2 * ONE_CHAR
      const items = this.items()
      let sum = 0
      for (const item of items) {
        sum += item.guessWidth()
      }
      sum += comma * (items.length - 1)
      sum += wrap
      return sum
    }
  }
}

export default compoundField
