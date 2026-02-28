module.exports = {
  id: "automatic-water-trough-c009",
  name: "Automatic Water Trough",
  deck: "minorC",
  number: 9,
  type: "minor",
  cost: { wood: 1 },
  category: "Livestock Provider",
  text: "If you can accommodate the animal, you can immediately buy 1 sheep/wild boar/cattle for 0/1/2 food.",
  onPlay(game, player) {
    const choices = []
    if (player.canPlaceAnimals('sheep', 1)) {
      choices.push('Buy 1 sheep (free)')
    }
    if (player.food >= 1 && player.canPlaceAnimals('boar', 1)) {
      choices.push('Buy 1 wild boar for 1 food')
    }
    if (player.food >= 2 && player.canPlaceAnimals('cattle', 1)) {
      choices.push('Buy 1 cattle for 2 food')
    }
    if (choices.length === 0) {
      return
    }
    choices.push('Skip')
    const selection = game.actions.choose(player, choices, {
      title: 'Automatic Water Trough',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Buy 1 sheep (free)') {
      game.actions.handleAnimalPlacement(player, { sheep: 1 })
      game.log.add({
        template: '{player} buys 1 sheep using {card}',
        args: { player, card: this },
      })
    }
    else if (selection[0] === 'Buy 1 wild boar for 1 food') {
      player.payCost({ food: 1 })
      game.actions.handleAnimalPlacement(player, { boar: 1 })
      game.log.add({
        template: '{player} buys 1 wild boar for 1 food using {card}',
        args: { player, card: this },
      })
    }
    else if (selection[0] === 'Buy 1 cattle for 2 food') {
      player.payCost({ food: 2 })
      game.actions.handleAnimalPlacement(player, { cattle: 1 })
      game.log.add({
        template: '{player} buys 1 cattle for 2 food using {card}',
        args: { player, card: this },
      })
    }
  },
}
