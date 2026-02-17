module.exports = {
  id: "riparian-builder-a128",
  name: "Riparian Builder",
  deck: "occupationA",
  number: 128,
  type: "occupation",
  players: "1+",
  text: "Each time another player uses the \"Reed Bank\" accumulation space, you can build a room: if you build a clay/stone room, you get a discount of 1 clay/2 stone.",
  onAnyAction(game, actingPlayer, actionId, cardOwner) {
    if (actionId === 'take-reed' && actingPlayer.name !== cardOwner.name) {
      const player = cardOwner
      const card = this
      if (player.getValidRoomBuildSpaces().length === 0) {
        return
      }
      const roomType = player.roomType
      const discount = roomType === 'clay' ? { clay: 1 } : roomType === 'stone' ? { stone: 2 } : null
      const canAffordWithDiscount = discount
        ? player.getRoomCostOptions().some(opt => {
          const cost = { ...opt.cost }
          if (discount.clay) {
            cost.clay = Math.max(0, (cost.clay || 0) - 1)
          }
          if (discount.stone) {
            cost.stone = Math.max(0, (cost.stone || 0) - 2)
          }
          return player.canAffordCost(cost)
        })
        : player.canAffordRoom()
      if (!canAffordWithDiscount) {
        return
      }
      const choices = ['Build a room', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Build a room (clay/stone discount)?`,
        min: 1,
        max: 1,
      })
      if (selection[0] === 'Build a room') {
        game.actions.buildRoom(player, { riparianBuilderCard: card })
      }
    }
  },
}
