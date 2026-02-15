module.exports = {
  id: "forest-scientist-b139",
  name: "Forest Scientist",
  deck: "occupationB",
  number: 139,
  type: "occupation",
  players: "3+",
  text: "In the returning home phase of each round, if there is no wood left on the game board, you get 1 food - from round 5 on, even 2 food.",
  onReturnHome(game, player) {
    const woodSpaceIds = ['take-wood', 'copse', 'grove', 'copse-5', 'grove-5', 'grove-6']
    const totalWood = woodSpaceIds.reduce((sum, id) => {
      const space = game.state.actionSpaces[id]
      return sum + (space ? (space.accumulated || 0) : 0)
    }, 0)
    if (totalWood === 0) {
      const food = game.state.round >= 5 ? 2 : 1
      player.addResource('food', food)
      game.log.add({
        template: '{player} gets {amount} food from Forest Scientist',
        args: { player, amount: food },
      })
    }
  },
}
