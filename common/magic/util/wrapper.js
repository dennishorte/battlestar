class Wrapper {
  constructor(obj) {
    this._originalFields = Object.keys(obj)
    Object.assign(this, obj)
  }

  toJSON() {
    const output = {}
    for (const field of this._originalFields) {
      output[field] = this[field]
    }
    return output
  }
}

module.exports = Wrapper
