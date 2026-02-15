module.exports = {
  id: "house-artist-a149",
  name: "House Artist",
  deck: "occupationA",
  number: 149,
  type: "occupation",
  players: "3+",
  text: "Each time you use the \"Traveling Players\" accumulation space, you also get a \"Build Rooms\" action. Each room you build during the action costs you 1 reed less.",
  onAction(game, player, actionId) {
    if (actionId !== 'traveling-players') {
      return
    }
    const validSpaces = player.getValidRoomBuildSpaces()
    const roomOptions = player.getRoomCostOptions()
    const canAffordWithDiscount = roomOptions.some(opt => {
      const cost = { ...opt.cost }
      cost.reed = Math.max(0, (cost.reed || 0) - 1)
      return player.canAffordCost(cost)
    })
    if (validSpaces.length === 0 || !canAffordWithDiscount) {
      return
    }
    const choices = ['Build a room', 'Skip']
    const selection = game.actions.choose(player, choices, {
      title: 'House Artist: Build a room (1 reed discount)?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    game.actions.buildRoom(player, { discount: { reed: 1 } })
  },
}
