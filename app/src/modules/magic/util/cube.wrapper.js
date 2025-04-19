const { mag } = require('battlestar-common')

class UICubeWrapper extends mag.util.wrapper.cube {
  constructor(cube) {
    super(cube)
  }
}

module.exports = UICubeWrapper
