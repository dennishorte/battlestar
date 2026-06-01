module.exports = {
  id: "wooden-whey-bucket-d016",
  name: "Wooden Whey Bucket",
  deck: "minorD",
  number: 16,
  type: "minor",
  cost: { wood: 1, food: 1 },
  category: "Farm Planner",
  text: "Each time before you use the \"Sheep Market\"/\"Cattle Market\" accumulation space, you can build exactly 1 stable for 1 wood/at no cost.",
  matches_onBeforeAction(_game, _player, actionId) {
    return actionId === 'take-sheep' || actionId === 'take-cattle'
  },
  onBeforeAction(game, player, actionId) {
    const validSpaces = player.getValidStableBuildSpaces()
    if (validSpaces.length === 0) {
      return
    }

    const isFree = actionId === 'take-cattle'
    const costLabel = isFree ? 'free' : '1 wood'

    if (!isFree && player.wood < 1) {
      return
    }

    const selection = game.actions.choose(player, [
      game.actions.option({ id: 'build', title: `Build 1 stable (${costLabel})` }),
      game.actions.option({ id: 'skip', title: 'Skip' }),
    ], { title: 'Wooden Whey Bucket', min: 1, max: 1 })

    if (selection[0].id !== 'skip') {
      const spaceChoices = validSpaces.map(s => game.actions.option({
        id: `space-${s.row}-${s.col}`,
        title: `${s.row},${s.col}`,
      }))
      const locResult = game.actions.choose(player, spaceChoices, {
        title: 'Choose stable location',
        min: 1,
        max: 1,
      })
      const [, rowStr, colStr] = locResult[0].id.match(/^space-(\d+)-(\d+)$/)
      const row = Number(rowStr)
      const col = Number(colStr)

      if (!isFree) {
        player.addResource('wood', -1)
      }
      player.buildStable(row, col)
      game.log.add({
        template: '{player} builds a stable at ({row},{col}) ({cost})',
        args: { player, row, col, cost: costLabel },
      })
    }
  },
}
