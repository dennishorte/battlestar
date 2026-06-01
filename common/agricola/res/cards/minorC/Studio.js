module.exports = {
  id: "studio-c055",
  name: "Studio",
  deck: "minorC",
  number: 55,
  type: "minor",
  cost: { clay: 1, reed: 1 },
  vps: 1,
  category: "Food Provider",
  text: "In the feeding phase of each harvest, you can use this card to turn exactly 1 wood/clay/stone into 2/2/3 food.",
  matches_onFeedingPhase(_game, player) {
    return player.wood >= 1 || player.clay >= 1 || player.stone >= 1
  },
  onFeedingPhase(game, player) {
    const choices = []
    if (player.wood >= 1) {
      choices.push(game.actions.option({ id: 'wood', title: 'Convert 1 wood into 2 food' }))
    }
    if (player.clay >= 1) {
      choices.push(game.actions.option({ id: 'clay', title: 'Convert 1 clay into 2 food' }))
    }
    if (player.stone >= 1) {
      choices.push(game.actions.option({ id: 'stone', title: 'Convert 1 stone into 3 food' }))
    }
    choices.push(game.actions.option({ id: 'skip', title: 'Skip' }))
    const selection = game.actions.choose(player, choices, {
      title: 'Studio',
      min: 1,
      max: 1,
    })
    if (selection[0].id === 'wood') {
      player.payCost({ wood: 1 })
      player.addResource('food', 2)
    }
    else if (selection[0].id === 'clay') {
      player.payCost({ clay: 1 })
      player.addResource('food', 2)
    }
    else if (selection[0].id === 'stone') {
      player.payCost({ stone: 1 })
      player.addResource('food', 3)
    }
    if (selection[0].id !== 'skip') {
      game.log.add({
        template: '{player} converts a resource into food',
        args: { player },
      })
    }
  },
}
