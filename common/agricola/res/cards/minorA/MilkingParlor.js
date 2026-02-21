module.exports = {
  id: "milking-parlor-a057",
  name: "Milking Parlor",
  deck: "minorA",
  number: 57,
  type: "minor",
  cost: { wood: 2 },
  vps: 1,
  prereqs: { unusedFarmyard: 4 },
  category: "Food Provider",
  text: "When you play this card, if you have at least 1/3/4 sheep, you immediately get 2/3/4 food. The same applies if you have at least 1/2/3 cattle.",
  onPlay(game, player) {
    const sheep = player.getTotalAnimals('sheep')
    const cattle = player.getTotalAnimals('cattle')
    let food = 0

    if (sheep >= 4) {
      food += 4
    }
    else if (sheep >= 3) {
      food += 3
    }
    else if (sheep >= 1) {
      food += 2
    }

    if (cattle >= 3) {
      food += 4
    }
    else if (cattle >= 2) {
      food += 3
    }
    else if (cattle >= 1) {
      food += 2
    }

    if (food > 0) {
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from {card}',
        args: { player, amount: food , card: this},
      })
    }
  },
}
