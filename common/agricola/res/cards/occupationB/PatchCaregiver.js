module.exports = {
  id: "patch-caregiver-b113",
  name: "Patch Caregiver",
  deck: "occupationB",
  number: 113,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can choose to buy 1 grain for 1 food, or 1 vegetable for 3 food. This card is a field.",
  isField: true,
  onPlay(game, player) {
    player.addVirtualField({
      cardId: 'patch-caregiver-b113',
      label: 'Patch Caregiver',
      cropRestriction: null,
    })
    game.log.add({
      template: '{player} plays Patch Caregiver, gaining a field',
      args: { player },
    })
    const choices = []
    if (player.food >= 1) {
      choices.push('Buy 1 grain for 1 food')
    }
    if (player.food >= 3) {
      choices.push('Buy 1 vegetable for 3 food')
    }
    choices.push('Skip')
    if (choices.length === 1) {
      return
    }
    const selection = game.actions.choose(player, choices, {
      title: 'Patch Caregiver: Buy crop?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    if (selection[0] === 'Buy 1 grain for 1 food') {
      player.payCost({ food: 1 })
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} buys 1 grain for 1 food (Patch Caregiver)',
        args: { player },
      })
    }
    else {
      player.payCost({ food: 3 })
      player.addResource('vegetables', 1)
      game.log.add({
        template: '{player} buys 1 vegetable for 3 food (Patch Caregiver)',
        args: { player },
      })
    }
  },
}
