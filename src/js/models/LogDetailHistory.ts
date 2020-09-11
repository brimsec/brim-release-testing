export default class LogDetailHistory<T> {
  entries: T[]
  position: number

  constructor(entries: T[] = [], position = 0) {
    this.entries = entries
    this.position = position
  }

  clear() {
    this.entries = []
    this.position = 0
  }

  save(entry: T) {
    this.entries.push(entry)
    this.position = 0
  }

  nextExists() {
    return this.position > 0
  }

  prevExists() {
    return this.position + 1 < this.entries.length
  }

  get(position: number) {
    const index = this.entries.length - 1 - position
    return this.entries[index]
  }

  getMostRecent() {
    if (!this.entries.length) return null
    return this.entries[this.entries.length - 1]
  }

  getCurrent(): T | null | undefined {
    if (!this.entries.length) return null
    const index = this.entries.length - 1 - this.position
    return this.entries[index]
  }

  updateCurrent(updates: Partial<T>) {
    if (!this.entries.length) return null
    const index = this.entries.length - 1 - this.position
    const entry = this.entries[index]
    this.entries[index] = {...entry, ...updates}
  }

  goBack() {
    if (this.prevExists()) {
      this.position += 1
    }
  }

  goForward() {
    if (this.nextExists()) {
      this.position -= 1
    }
  }

  getPrev() {
    if (!this.prevExists()) return null
    return this.get(this.position + 1)
  }

  getNext() {
    if (!this.nextExists()) return null
    return this.get(this.position - 1)
  }

  toArray() {
    return this.entries
  }
}
