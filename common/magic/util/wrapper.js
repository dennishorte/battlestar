const util = require('../../lib/util.js')


class Wrapper {
  constructor(obj) {
    if (obj._wrapped) {
      throw new Error('cannot rewrap an object')
    }

    this._originalFields = Object.keys(obj)
    Object.assign(this, obj)
    this._wrapped = true
  }

  toJSON() {
    const output = {}
    for (const field of this._originalFields) {
      output[field] = this[field]
    }
    return util.deepcopy(output)
  }
}

module.exports = Wrapper
