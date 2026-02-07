module.exports = {
  id: "outskirts-director-c130",
  name: "Outskirts Director",
  deck: "occupationC",
  number: 130,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Grove\" or \"Hollow\" accumulation space, you can place 2 reed from the general supply on the other space. If you do, you can immediately place another person.",
  onAction(game, player, actionId) {
    if (actionId === 'copse') {
      game.actions.offerOutskirtsDirectorBonus(player, this, 'take-clay-2')
    }
    else if (actionId === 'take-clay-2') {
      game.actions.offerOutskirtsDirectorBonus(player, this, 'copse')
    }
  },
}
