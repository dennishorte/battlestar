'use strict'

module.exports = {
  name: 'Chani',
  source: 'Bloodlines',
  compatibility: 'All',
  house: null,
  startingEffect: null,
  leaderAbility: 'Tactician\nWhenever you retreat or lose troops from the Conflict:\n· Advance your Tactics token that many spaces, earning rewards\n· Reset the token after reaching the end of the track',
  signetRingAbility: 'Fedaykin Maneuver\n· Retreat any number of your troops\n  OR\n· If you have 2+ Fremen Influence: Trade 1 Water for 2 Draws',
  complexity: 2,

  resolveSignetRing(game, player, _resolveEffectFn) {
    const deckEngine = require('../../systems/deckEngine.js')
    const deployedTroops = game.state.conflict?.deployedTroops?.[player.name] || 0
    const canTrade = player.getInfluence('fremen') >= 2 && player.water >= 1

    let action = 'retreat'
    if (canTrade) {
      const choices = [
        game.actions.option({ id: 'retreat', title: 'Retreat any number of troops' }),
        game.actions.option({ id: 'trade', title: 'Trade 1 Water for 2 Draws' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Fedaykin Maneuver' })
      action = typeof choice === 'object' ? choice.id : choice
    }

    if (action === 'retreat' || action === 'Retreat any number of troops') {
      if (deployedTroops === 0) {
        game.log.add({ template: '{player}: Fedaykin Maneuver — no troops to retreat', args: { player } })
        return
      }
      const countChoices = Array.from({ length: deployedTroops + 1 }, (_, i) =>
        game.actions.option({ id: String(i), title: i === 0 ? 'Pass' : `${i} troop${i === 1 ? '' : 's'}` })
      )
      const [countChoice] = game.actions.choose(player, countChoices, { title: 'Fedaykin Maneuver: how many troops to retreat?' })
      const countId = typeof countChoice === 'object' ? countChoice.id : countChoice
      const count = parseInt(countId, 10)
      if (count > 0) {
        game.state.conflict.deployedTroops[player.name] -= count
        player.incrementCounter('troopsInSupply', count, { silent: true })
        game.log.add({
          template: '{player}: Fedaykin Maneuver — retreats {count} troop(s)',
          args: { player, count },
        })
      }
    }
    else {
      player.decrementCounter('water', 1, { silent: true })
      deckEngine.drawCards(game, player, 2)
      game.log.add({ template: '{player}: Fedaykin Maneuver — trades 1 Water for 2 draws', args: { player } })
    }
  },
}
