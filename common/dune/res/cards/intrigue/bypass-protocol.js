'use strict'

const deckEngine = require('../../../systems/deckEngine.js')

module.exports = {
  id: "bypass-protocol",
  name: "Bypass Protocol",
  source: "Base",
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
  plotText: "· Acquire a card that costs 3 Persuasion or less\n  OR\n· Pay 2 Spice → Acquire a card that costs 5 Persuasion to the top of your deck",

  plotEffect(game, player) {
    const rowZone = game.zones.byId('common.imperiumRow')
    const allCards = rowZone.cardlist()
    const cheapCards = allCards.filter(c => (c.persuasionCost || 0) <= 3)
    const mediumCards = allCards.filter(c => (c.persuasionCost || 0) <= 5)

    const choices = []
    if (cheapCards.length > 0) {
      choices.push(game.actions.option({ id: 'cheap', title: 'Acquire card costing 3 Persuasion or less' }))
    }
    if (player.spice >= 2 && mediumCards.length > 0) {
      choices.push(game.actions.option({ id: 'expensive', title: 'Pay 2 Spice: Acquire card costing 5 or less (to top of deck)' }))
    }
    choices.push(game.actions.option({ id: 'pass', title: 'Pass' }))

    const [choice] = game.actions.choose(player, choices, { title: 'Bypass Protocol' })
    const chId = typeof choice === 'object' ? choice.id : choice
    const isCheap = chId === 'cheap' || (typeof choice === 'string' && choice.includes('3'))
    const isExpensive = chId === 'expensive' || (typeof choice === 'string' && choice.includes('5'))

    if (!isCheap && !isExpensive) {
      return
    }

    const eligible = isCheap ? cheapCards : mediumCards
    const passSentinel = { name: 'Pass', id: '__pass__' }
    const [chosen] = game.actions.chooseCards(player, [passSentinel, ...eligible], {
      title: isCheap
        ? 'Bypass Protocol: acquire a card costing 3 Persuasion or less'
        : 'Bypass Protocol: acquire a card costing 5 Persuasion or less (to top of deck)',
      kind: 'imperium-card',
    })
    if (!chosen || chosen.id === '__pass__') {
      return
    }

    if (isExpensive) {
      player.decrementCounter('spice', 2)
      const deckZone = game.zones.byId(`${player.name}.deck`)
      chosen.moveTo(deckZone)
      deckEngine.refillImperiumRow(game)
      game.log.add({ template: '{player} acquires {card} to top of deck (Bypass Protocol)', args: { player, card: chosen } })
    }
    else {
      deckEngine.acquireCard(game, player, chosen)
    }
  },

}
