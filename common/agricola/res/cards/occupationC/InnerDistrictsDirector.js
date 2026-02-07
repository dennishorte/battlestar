module.exports = {
  id: "inner-districts-director-c093",
  name: "Inner Districts Director",
  deck: "occupationC",
  number: 93,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Forest\" or \"Clay Pit\" accumulation space, you can place 1 stone from the general supply on the other space. If you do, you can immediately place another person.",
  onAction(game, player, actionId) {
    if (actionId === 'take-wood') {
      game.actions.offerInnerDistrictsDirectorBonus(player, this, 'take-clay')
    }
    else if (actionId === 'take-clay') {
      game.actions.offerInnerDistrictsDirectorBonus(player, this, 'take-wood')
    }
  },
}
