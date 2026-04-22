'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
const factions = require('../../../systems/factions.js')
const constants = require('../../constants.js')
const { addStrength } = require('../../../systems/strengthBreakdown.js')

module.exports = {
  id: "tenuous-bond",
  name: "Tenuous Bond",
  source: "Bloodlines",
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
  vpsAvailable: 0,
  endgameEffect: null,

  plotEffect(game, player) {
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = ['Pass', ...loseFactions.map(f => `Lose 1 ${f}`)]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      if (choice !== 'Pass') {
        const loseFaction = loseFactions.find(f => choice.includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const [gf] = game.actions.choose(player, constants.FACTIONS, { title: '+1 Influence' })
        factions.gainInfluence(game, player, gf)
      }
    }
  },

  combatEffect(game, player) {
    // Trash a card from discard that costs 1+ Persuasion -> +4 Swords
    const discardZone = game.zones.byId(`${player.name}.discard`)
    const trashable = discardZone.cardlist().filter(c => c.persuasionCost > 0)
    if (trashable.length > 0) {
      const choices = ['Pass', ...trashable.map(c => c.name)]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash from discard for +4 Swords?' })
      if (choice !== 'Pass') {
        const card = trashable.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
          addStrength(game, player, 'card', 'Tenuous Bond', 4 * constants.SWORD_STRENGTH)
        }
      }
    }
  },

}
