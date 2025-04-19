class Wrapper {
  #originalFields

  constructor(obj) {
    this.#originalFields = Object.keys(obj)
    Object.assign(this, obj)
  }

  toJSON() {
    const output = {}
    for (const field of this.#originalFields) {
      output[field] = this[field]
    }
    return output
  }
}

module.exports = Wrapper
