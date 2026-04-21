/**
 * Phase 4: Makers
 * Place 1 spice on each Maker space that does not have an Agent.
 */
function makersPhase(game) {
  game.state.phase = 'makers'
  game.log.add({ template: 'Makers', event: 'phase-start' })

  const boardSpaces = require('../res/boardSpaces.js')
  const makerSpaces = boardSpaces.filter(s => s.isMakerSpace).map(s => s.id)

  for (const spaceId of makerSpaces) {
    if (!game.state.boardSpaces[spaceId]) {
      game.state.bonusSpice[spaceId] = (game.state.bonusSpice[spaceId] || 0) + 1
      game.log.add({
        template: '+1 bonus Spice on {boardSpace} (now {total})',
        args: {
          boardSpace: spaceId,
          total: game.state.bonusSpice[spaceId],
        },
      })
    }
  }
}

module.exports = { makersPhase }
