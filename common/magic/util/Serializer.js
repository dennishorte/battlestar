const util = require('../../lib/util.js')


class Serializer {
  constructor(parent, data) {
    this.parent = parent
    this.data = data
  }

  inject() {
    Object.assign(this.parent, this.data)
  }

  serialize() {
    const output = {}
    for (const key of Object.keys(this.data)) {
      output[key] = this.parent[key]
    }
    return util.deepcopy(output)
  }
}

module.exports = {
  Serializer,
}
