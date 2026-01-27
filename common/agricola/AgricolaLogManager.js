const { BaseLogManager } = require('../lib/game/index.js')


class AgricolaLogManager extends BaseLogManager {
  _registerDefaultHandlers() {
    super._registerDefaultHandlers()

    // Handler for resource amounts - handles both string type and {amount, type} object
    this.registerHandler('resource*', (resource) => {
      if (typeof resource === 'string') {
        return { value: resource, classes: ['resource'] }
      }
      return {
        value: `${resource.amount} ${resource.type}`,
        classes: ['resource'],
      }
    })

    // Handler for action spaces
    this.registerHandler('action*', (action) => ({
      value: action.name || action,
      classes: ['action-space'],
    }))
  }
}

module.exports = { AgricolaLogManager }
