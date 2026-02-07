module.exports = {
  id: "roastmaster-e166",
  name: "Roastmaster",
  deck: "occupationE",
  number: 166,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Traveling Players\" or \"Fishing\" accumulation spaces, you can move exactly 1 food from that space to the other to get 1 cattle.",
  onAction(game, player, actionId) {
    if (actionId === 'traveling-players' || actionId === 'fishing') {
      const otherSpace = actionId === 'traveling-players' ? 'fishing' : 'traveling-players'
      if (game.canMoveFood(actionId, otherSpace) && player.canPlaceAnimals('cattle', 1)) {
        game.actions.offerRoastmasterMove(player, this, actionId, otherSpace)
      }
    }
  },
}
