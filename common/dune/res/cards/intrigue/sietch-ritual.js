'use strict'

const factions = require('../../../systems/factions.js')
const deckEngine = require('../../../systems/deckEngine.js')

module.exports = {
  id: "sietch-ritual",
  name: "Sietch Ritual",
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
  vpsAvailable: 0,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Discard a card → +1 Influence with Bene Gesserit or Fremen",

  plotEffect(game, player) {
    const handZone = game.zones.byId(`${player.name}.hand`)
    const handCards = handZone.cardlist()
    if (handCards.length === 0) {
      game.log.add({
        template: '{player}: no cards to discard — no effect',
        args: { player },
        event: 'memo',
      })
      return
    }
    const discardCard = game.actions.chooseCard(player, handCards, {
      title: 'Choose a card to discard',
      kind: 'imperium-card',
    })
    if (discardCard) {
      deckEngine.discardCard(game, player, discardCard)
    }

    const [factionChoice] = game.actions.choose(player, [
      game.actions.option({ id: 'bene-gesserit', title: 'Bene Gesserit', kind: 'faction' }),
      game.actions.option({ id: 'fremen', title: 'Fremen', kind: 'faction' }),
    ], {
      title: 'Choose a faction',
    })
    const chId = typeof factionChoice === 'object' ? factionChoice.id : null
    const faction = chId
      ? chId
      : (factionChoice === 'Bene Gesserit' ? 'bene-gesserit' : 'fremen')
    factions.gainInfluence(game, player, faction, 1)
  },
}
