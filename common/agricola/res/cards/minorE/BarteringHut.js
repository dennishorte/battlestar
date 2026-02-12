module.exports = {
  id: "bartering-hut-e009",
  name: "Bartering Hut",
  deck: "minorE",
  number: 9,
  type: "minor",
  cost: {},
  text: "Up to two times: Immediately spend any 2/3/4 building resources for 1 sheep/wild boar/cattle from the general supply.",
  onPlay(game, player) {
    const getBuildingTotal = () => player.wood + player.clay + player.reed + player.stone

    const payBuildingResources = (amount) => {
      let remaining = amount
      // Deduct from most abundant first
      const resources = ['wood', 'clay', 'reed', 'stone']
        .sort((a, b) => player[b] - player[a])
      for (const r of resources) {
        const deduct = Math.min(remaining, player[r])
        if (deduct > 0) {
          player.addResource(r, -deduct)
          remaining -= deduct
        }
        if (remaining <= 0) {
          break
        }
      }
    }

    for (let attempt = 0; attempt < 2; attempt++) {
      const total = getBuildingTotal()
      if (total < 2) {
        break
      }

      const choices = []
      if (total >= 2 && player.canPlaceAnimals('sheep', 1)) {
        choices.push('Spend 2 resources for 1 sheep')
      }
      if (total >= 3 && player.canPlaceAnimals('boar', 1)) {
        choices.push('Spend 3 resources for 1 boar')
      }
      if (total >= 4 && player.canPlaceAnimals('cattle', 1)) {
        choices.push('Spend 4 resources for 1 cattle')
      }
      if (choices.length === 0) {
        break
      }
      choices.push('Done')

      const selection = game.actions.choose(player, choices, {
        title: `Bartering Hut (${attempt + 1}/2)`,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Done') {
        break
      }

      if (selection[0].includes('sheep')) {
        payBuildingResources(2)
        player.addAnimals('sheep', 1)
        game.log.add({
          template: '{player} buys 1 sheep for 2 building resources using {card}',
          args: { player, card: this },
        })
      }
      else if (selection[0].includes('boar')) {
        payBuildingResources(3)
        player.addAnimals('boar', 1)
        game.log.add({
          template: '{player} buys 1 wild boar for 3 building resources using {card}',
          args: { player, card: this },
        })
      }
      else if (selection[0].includes('cattle')) {
        payBuildingResources(4)
        player.addAnimals('cattle', 1)
        game.log.add({
          template: '{player} buys 1 cattle for 4 building resources using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
