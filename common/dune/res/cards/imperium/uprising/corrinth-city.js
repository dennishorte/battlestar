'use strict'

const deckEngine = require('../../../../systems/deckEngine.js')
module.exports = {
  id: "corrinth-city",
  name: "Corrinth City",
  source: "Uprising",
  compatibility: "All",
  count: 1,
  persuasionCost: 6,
  acquisitionBonus: null,
  passiveAbility: null,
  agentIcons: [
    "green"
  ],
  factionAccess: [
    "emperor"
  ],
  spyAccess: false,
  agentAbility: "Discard two cards and pay 5 Solari → +1 Victory Point",
  revealPersuasion: 0,
  revealSwords: 0,
  revealAbility: "· 5 Solari\n  OR\n· Pay 5 Solari → Take your seat on the High Council",
  factionAffiliation: "emperor",
  vpsAvailable: 9,
  hasTech: false,
  hasShipping: false,
  hasUnload: false,
  hasInfiltration: false,
  hasResearch: false,
  hasGrafting: false,
  hasSpies: false,
  hasSandworms: false,
  hasContracts: false,
  hasBattleIcons: false,
  hasSardaukar: false,

  agentEffect(game, player) {
    // Discard two cards and pay 5 Solari -> +1 VP
    const handZone = game.zones.byId(`${player.name}.hand`)
    if (handZone.cardlist().length >= 2 && player.solari >= 5) {
      const choices = [
        game.actions.option({ id: 'pass', title: 'Pass' }),
        game.actions.option({ id: 'pay', title: 'Discard 2 cards and pay 5 Solari for +1 VP' }),
      ]
      const [choice] = game.actions.choose(player, choices, { title: 'Corrinth City' })
      const chId = typeof choice === 'object' ? choice.id : choice
      if (chId !== 'pass' && choice !== 'Pass') {
        for (let i = 0; i < 2; i++) {
          const cards = handZone.cardlist()
          if (cards.length > 0) {
            const card = game.actions.chooseCard(player, cards, { title: 'Discard a card', kind: 'imperium-card' })
            if (card) {
              deckEngine.discardCard(game, player, card)
            }
          }
        }
        player.decrementCounter('solari', 5, { silent: true })
        player.incrementCounter('vp', 1, { silent: true, source: 'Corrinth City' })
        game.log.add({ template: '{player} gains 1 Victory Point', args: { player } })
      }
    }
  },

  revealEffect(game, player) {
    const choices = [game.actions.option({ id: 'solari', title: '+5 Solari' })]
    if (!player.hasHighCouncil && player.solari >= 5) {
      choices.push(game.actions.option({ id: 'council', title: 'Pay 5 Solari for High Council seat' }))
    }
    const [choice] = game.actions.choose(player, choices, { title: 'Corrinth City' })
    const chId = typeof choice === 'object' ? choice.id : choice
    if (chId === 'solari' || choice === '+5 Solari') {
      player.incrementCounter('solari', 5, { silent: true })
      game.log.add({ template: '{player} gains 5 Solari', args: { player } })
    }
    else if (chId === 'council' || choice === 'Pay 5 Solari for High Council seat') {
      player.decrementCounter('solari', 5, { silent: true })
      player.setCounter('hasHighCouncil', 1, { silent: true })
      game.log.add({ template: '{player} takes High Council seat', args: { player } })
    }
  },

  previewReveal(game, player) {
    const canBuySeat = !player.hasHighCouncil && player.solari >= 5
    if (!canBuySeat) {
      return { solari: 5 }
    }
    return { pending: 'Choice: +5 Solari OR pay 5 Solari → High Council seat' }
  },

}
