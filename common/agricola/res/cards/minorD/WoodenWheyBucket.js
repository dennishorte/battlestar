module.exports = {
  id: "wooden-whey-bucket-d016",
  name: "Wooden Whey Bucket",
  deck: "minorD",
  number: 16,
  type: "minor",
  cost: { wood: 1, food: 1 },
  category: "Farm Planner",
  text: "Each time before you use the \"Sheep Market\"/\"Cattle Market\" accumulation space, you can build exactly 1 stable for 1 wood/at no cost.",
  onBeforeAction(game, player, actionId) {
    if (actionId === 'take-sheep' || actionId === 'take-cattle') {
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
        `Build 1 stable (${costLabel})`,
        'Skip',
      ], { title: 'Wooden Whey Bucket', min: 1, max: 1 })

      if (selection[0] !== 'Skip') {
        const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
        const locResult = game.actions.choose(player, spaceChoices, {
          title: 'Choose stable location',
          min: 1,
          max: 1,
        })
        const [row, col] = locResult[0].split(',').map(Number)

        if (!isFree) {
          player.addResource('wood', -1)
        }
        player.buildStable(row, col)
        game.log.add({
          template: '{player} builds a stable at ({row},{col}) via Wooden Whey Bucket ({cost})',
          args: { player, row, col, cost: costLabel },
        })
      }
    }
  },
}
