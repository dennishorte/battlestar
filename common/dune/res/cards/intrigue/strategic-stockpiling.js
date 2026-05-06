'use strict'

module.exports = {
  id: "strategic-stockpiling",
  name: "Strategic Stockpiling",
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
  vpsAvailable: 2,
  combatEffect: null,
  endgameEffect: null,
  plotText: "Pay 5 Spice → +1 Victory Point; If you have 3 Influence with the Fremen, pay 3 Water → +1 Victory Point",

  plotEffect(game, player) {
    // First leg: Pay 5 Spice -> +1 VP (optional)
    if (player.getCounter('spice') >= 5) {
      const choices = ['Pass', 'Pay 5 Spice: +1 VP']
      const [choice] = game.actions.choose(player, choices, { title: 'Strategic Stockpiling: Spice' })
      if (choice !== 'Pass') {
        player.decrementCounter('spice', 5, { silent: true })
        player.gainVp(1, 'Strategic Stockpiling')
        game.log.add({ template: '{player}: pays 5 Spice, +1 VP', args: { player } })
      }
    }

    // Second leg: gated on Fremen influence — Pay 3 Water -> +1 VP (optional)
    if (player.getInfluence('fremen') >= 3 && player.getCounter('water') >= 3) {
      const choices = ['Pass', 'Pay 3 Water: +1 VP']
      const [choice] = game.actions.choose(player, choices, { title: 'Strategic Stockpiling: Water' })
      if (choice !== 'Pass') {
        player.decrementCounter('water', 3, { silent: true })
        player.gainVp(1, 'Strategic Stockpiling')
        game.log.add({ template: '{player}: pays 3 Water, +1 VP', args: { player } })
      }
    }
  },
}
