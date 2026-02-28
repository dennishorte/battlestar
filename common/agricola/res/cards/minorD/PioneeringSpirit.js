module.exports = {
  id: "pioneering-spirit-d023",
  name: "Pioneering Spirit",
  deck: "minorD",
  number: 23,
  type: "minor",
  cost: {},
  category: "Actions Booster",
  text: "This card is an action space for you only. In rounds 3-5, it provides a \"Renovation\" action. In rounds 6-8, it provides your choice of 1 vegetable, wild boar, or cattle.",
  providesActionSpace: true,
  ownerOnly: true,
  actionSpaceId: "pioneering-spirit",
  onActionSpaceUsed(game, player) {
    const round = game.state.round
    if (round >= 3 && round <= 5) {
      if (player.canRenovate()) {
        player.renovate()
        game.log.add({
          template: '{player} renovates using {card}',
          args: { player, card: this },
        })
      }
    }
    else if (round >= 6 && round <= 8) {
      const selection = game.actions.choose(player, [
        'Take 1 vegetable',
        'Take 1 wild boar',
        'Take 1 cattle',
      ], {
        title: 'Pioneering Spirit',
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Take 1 vegetable') {
        player.addResource('vegetables', 1)
      }
      else if (selection[0] === 'Take 1 wild boar') {
        game.actions.handleAnimalPlacement(player, { boar: 1 })
      }
      else if (selection[0] === 'Take 1 cattle') {
        game.actions.handleAnimalPlacement(player, { cattle: 1 })
      }
      game.log.add({
        template: '{player} uses {card} to get {choice}',
        args: { player, choice: selection[0].toLowerCase() , card: this},
      })
    }
  },
}
