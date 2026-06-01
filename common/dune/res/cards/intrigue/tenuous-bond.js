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
  plotText: "Lose 1 Influence with any Faction → Gain 1 Influence with any Faction",
  combatText: "Trash a card from your discard pile that costs 1+ Persuasion → +4 Swords",

  plotEffect(game, player) {
    const loseFactions = constants.FACTIONS.filter(f => player.getInfluence(f) > 0)
    if (loseFactions.length > 0) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...loseFactions.map(f => game.actions.option({ id: `lose-${f}`, title: `Lose 1 ${f}`, kind: 'faction' })),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Swap influence?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const loseFaction = (typeof chId === 'string' && chId.startsWith('lose-'))
          ? chId.slice('lose-'.length)
          : loseFactions.find(f => (typeof choice === 'string' ? choice : choice.title).includes(f))
        factions.loseInfluence(game, player, loseFaction, 1)
        const fc = constants.FACTIONS.map(f => game.actions.option({ id: f, title: f, kind: 'faction' }))
        const [gChoice] = game.actions.choose(player, fc, { title: '+1 Influence' })
        const gf = typeof gChoice === 'object' ? gChoice.id : gChoice
        factions.gainInfluence(game, player, gf)
      }
    }
  },

  combatEffect(game, player) {
    // Trash a card from discard that costs 1+ Persuasion -> +4 Swords
    const discardZone = game.zones.byId(`${player.name}.discard`)
    const trashable = discardZone.cardlist().filter(c => c.persuasionCost > 0)
    if (trashable.length > 0) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        ...trashable.map(c => game.actions.cardOption(c, 'imperium-card')),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Trash from discard for +4 Swords?' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        const card = typeof choice === 'object'
          ? trashable.find(c => c.id === choice.id)
          : trashable.find(c => c.name === choice)
        if (card) {
          deckEngine.trashCard(game, card)
          addStrength(game, player, 'card', 'Tenuous Bond', 4 * constants.SWORD_STRENGTH)
        }
      }
    }
  },

}
