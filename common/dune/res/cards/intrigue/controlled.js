'use strict'

const deckEngine = require('../../../systems/deckEngine.js')
module.exports = {
  id: "controlled",
  name: "Controlled",
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
  isTwisted: true,
  vpsAvailable: 0,
  combatEffect: "+1 Sword",
  endgameEffect: null,
  plotText: "Look at the top card of your deck. You may put it back, discard it, or spend 1 Solari to draw it",

  plotEffect(game, player) {
    const deckZone = game.zones.byId(`${player.name}.deck`)
    const topCards = deckZone.cardlist()
    if (topCards.length > 0) {
      const topCard = topCards[0]
      const choices = [
        game.actions.option({ id: 'putback', title: `Put ${topCard.name} back` }),
        game.actions.option({ id: 'discard', title: `Discard ${topCard.name}` }),
      ]
      if (player.solari >= 1) {
        choices.push(game.actions.option({ id: 'draw', title: `Pay 1 Solari: Draw ${topCard.name}` }))
      }
      const [choice] = game.actions.choose(player, choices, { title: 'Controlled: Top card' })
      const chId = typeof choice === 'object' ? choice.id : choice
      const isDiscard = chId === 'discard' || (typeof choice === 'string' && choice.includes('Discard'))
      const isDraw = chId === 'draw' || (typeof choice === 'string' && choice.includes('Draw'))
      if (isDiscard) {
        deckEngine.discardCard(game, player, topCard)
      }
      else if (isDraw) {
        player.decrementCounter('solari', 1)
        const handZone = game.zones.byId(`${player.name}.hand`)
        topCard.moveTo(handZone)
      }
      // "Put back" = do nothing
    }
  },


  combatEffects: [
    {
      type: 'swords',
      amount: 1
    }
  ],
}
