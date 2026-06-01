module.exports = {
  id: "stable-sergeant-b167",
  name: "Stable Sergeant",
  deck: "occupationB",
  number: 167,
  type: "occupation",
  players: "4+",
  text: "When you play this card, you can pay 2 food to get 1 sheep, 1 wild boar, and 1 cattle, but only if you can accommodate all three animals on your farm.",
  onPlay(game, player) {
    if (player.food < 2) {
      return
    }
    if (!player.canPlaceAnimals('sheep', 1) ||
        !player.canPlaceAnimals('boar', 1) ||
        !player.canPlaceAnimals('cattle', 1)) {
      return
    }

    const choice = game.actions.choose(player, [
      game.actions.option({ id: 'pay', title: 'Pay 2 food for 1 sheep, 1 boar, 1 cattle' }),
      game.actions.option({ id: 'decline', title: 'Decline' }),
    ], {
      title: 'Stable Sergeant: pay 2 food for animals?',
      min: 1,
      max: 1,
    })

    if (choice[0].id === 'pay') {
      player.payCost({ food: 2 })
      game.actions.handleAnimalPlacement(player, { sheep: 1, boar: 1, cattle: 1 })
      game.log.add({
        template: '{player} pays 2 food for 1 sheep, 1 boar, 1 cattle from {card}',
        args: { player , card: this},
      })
    }
  },
}
