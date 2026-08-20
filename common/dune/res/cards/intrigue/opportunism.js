'use strict'

const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
module.exports = {
  id: "opportunism",
  name: "Opportunism",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  hasTech: false,
  hasShipping: false,
  hasResearch: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,
  isTwisted: false,
  vpsAvailable: 1,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Lose 1 Influence with 2 Factions of your choice and pay 2 Solari → +1 Victory Point",

  plotEffect(game, player) {
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (player.solari < 2 || loseFactions.length < 2) {
      game.log.addNoEffect()
      return
    }

    const choices = [
      game.actions.option({ id: 'pass', title: 'Pass' }),
      game.actions.option({ id: 'pay', title: 'Lose 1 Influence with 2 Factions + 2 Solari -> +1 VP' }),
    ]
    const [choice] = game.actions.choose(player, choices, { title: 'Opportunism' })
    const chId = typeof choice === 'object' ? choice.id : choice
    if (chId === 'pass' || choice === 'Pass') {
      return
    }

    const selections = game.actions.choose(
      player,
      loseFactions.map(f => factions.factionOption(game, f)),
      { title: 'Lose 1 Influence with 2 Factions', count: 2 },
    )
    for (const sel of selections) {
      const faction = factions.factionIdFromChoice(sel)
      if (faction) {
        factions.loseInfluence(game, player, faction, 1)
      }
    }
    player.decrementCounter('solari', 2)
    player.incrementCounter('vp', 1, { silent: true, source: 'Opportunism (intrigue)' })
    game.log.add({ template: '{player}: +1 VP', args: { player } })
  },

}
