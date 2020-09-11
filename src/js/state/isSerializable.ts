import {
  isArray,
  isBoolean,
  isNull,
  isNumber,
  isObject,
  isString
} from "../lib/is"

export default function isSerializable(object: Object) {
  traverse(object, (value) => {
    if (isString(value) || isNull(value) || isNumber(value) || isBoolean(value))
      return
    else console.log("WARNING", value, "is not serializable")
  })
}

function traverse(object, cb) {
  for (const key in object) {
    const value = object[key]
    if (isArray(value)) for (const item of value) traverse(item, cb)
    else if (isObject(value)) traverse(value, cb)
    else cb(value)
  }
}
