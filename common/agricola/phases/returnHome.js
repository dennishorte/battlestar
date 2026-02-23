const { Agricola } = require('../agricola.js')


Agricola.prototype.returnHomePhase = function() {
  this.log.add({ template: 'Workers return home' })

  // Call onReturnHome hooks before resetting workers
  this.callReturnHomeHooks()

  for (const player of this.players.all()) {
    player.resetWorkers()
  }

  // Clear all blocked states from linked spaces
  for (const actionId of this.state.activeActions) {
    if (this.state.actionSpaces[actionId].blockedBy) {
      delete this.state.actionSpaces[actionId].blockedBy
    }
  }

  // Clear created action spaces (e.g. Forest Tallyman gap) so they can appear again next round
  for (const player of this.players.all()) {
    for (const card of player.getActiveCards()) {
      const def = card.definition
      if (def.createsActionSpace && this.state.actionSpaces[def.createsActionSpace]) {
        this.state.actionSpaces[def.createsActionSpace].occupiedBy = null
      }
    }
  }
}
