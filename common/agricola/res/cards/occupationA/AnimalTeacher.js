module.exports = {
  id: "animal-teacher-a168",
  name: "Animal Teacher",
  deck: "occupationA",
  number: 168,
  type: "occupation",
  players: "4+",
  text: "Immediately after each time you use a \"Lessons\" action space, you can also buy 1 sheep/wild boar/cattle for 0/1/2 food.",
  onAction(game, player, actionId) {
    const isLessons = actionId === 'occupation' || (typeof actionId === 'string' && actionId.startsWith('lessons-'))
    if (!isLessons) {
      return
    }
    const cardName = 'Animal Teacher'
    const options = [
      { animal: 'sheep', food: 0, label: 'Buy 1 sheep for 0 food' },
      { animal: 'boar', food: 1, label: 'Buy 1 wild boar for 1 food' },
      { animal: 'cattle', food: 2, label: 'Buy 1 cattle for 2 food' },
    ]
    const choices = []
    for (const opt of options) {
      if (!player.canPlaceAnimals(opt.animal, 1)) {
        continue
      }
      const canAfford = opt.food === 0 || player.food >= opt.food || game.getAnytimeFoodConversionOptions(player).length > 0
      if (!canAfford) {
        continue
      }
      choices.push(opt.label)
    }
    if (choices.length === 0) {
      return
    }
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: `${cardName}: Buy 1 animal (0/1/2 food)?`,
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    const chosen = options.find(o => o.label === selection[0])
    if (!chosen) {
      return
    }
    if (chosen.food > 0) {
      player.payCost({ food: chosen.food })
    }
    game.actions.handleAnimalPlacement(player, { [chosen.animal]: 1 })
    game.log.add({
      template: '{player} buys 1 {animal} for {food} food using {card}',
      args: { player, animal: chosen.animal, food: chosen.food, card: cardName },
    })
  },
}
