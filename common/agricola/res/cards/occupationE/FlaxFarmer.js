module.exports = {
  id: "flax-farmer-e137",
  name: "Flax Farmer",
  deck: "occupationE",
  number: 137,
  type: "occupation",
  players: "1+",
  text: "Each time you use the \"Reed Bank\" accumulation space, you also get 1 grain. Each time you use the \"Grain Seeds\" action space, you also get 1 reed.",
  onAction(game, player, actionId) {
    if (actionId === 'take-reed') {
      player.addResource('grain', 1)
      game.log.add({
        template: '{player} gets 1 grain from Flax Farmer',
        args: { player },
      })
    }
    else if (actionId === 'take-grain') {
      player.addResource('reed', 1)
      game.log.add({
        template: '{player} gets 1 reed from Flax Farmer',
        args: { player },
      })
    }
  },
}
