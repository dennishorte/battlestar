module.exports = {
  id: "farm-store-c041",
  name: "Farm Store",
  deck: "minorC",
  number: 41,
  type: "minor",
  cost: { wood: 2, clay: 2 },
  category: "Building Resource Provider",
  text: "After the feeding phase of each harvest, you can exchange exactly 1 food for 2 different building resources of your choice or 1 vegetable.",
  matches_onFeedingPhaseEnd(_game, player) {
    return player.food >= 1
  },
  onFeedingPhaseEnd(game, player) {
    const choices = [
      game.actions.option({ id: 'wood-clay', title: '1 wood and 1 clay' }),
      game.actions.option({ id: 'wood-stone', title: '1 wood and 1 stone' }),
      game.actions.option({ id: 'wood-reed', title: '1 wood and 1 reed' }),
      game.actions.option({ id: 'clay-stone', title: '1 clay and 1 stone' }),
      game.actions.option({ id: 'clay-reed', title: '1 clay and 1 reed' }),
      game.actions.option({ id: 'stone-reed', title: '1 stone and 1 reed' }),
      game.actions.option({ id: 'vegetable', title: '1 vegetable' }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ]
    const selection = game.actions.choose(player, choices, {
      title: 'Farm Store: Exchange 1 food',
      min: 1,
      max: 1,
    })
    if (selection[0].id !== 'skip') {
      player.payCost({ food: 1 })
      if (selection[0].id === 'vegetable') {
        player.addResource('vegetables', 1)
      }
      else {
        const [r1, r2] = selection[0].id.split('-')
        player.addResource(r1, 1)
        player.addResource(r2, 1)
      }
      game.log.add({
        template: '{player} exchanges 1 food for {choice}',
        args: { player, choice: selection[0].title },
      })
    }
  },
}
