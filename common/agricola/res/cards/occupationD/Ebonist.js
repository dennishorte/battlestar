module.exports = {
  id: "ebonist-d155",
  name: "Ebonist",
  deck: "occupationD",
  number: 155,
  type: "occupation",
  players: "1+",
  text: "Each harvest, you can use this card to turn exactly 1 wood into 1 food and 1 grain.",
  onHarvest(game, player) {
    if (player.wood >= 1) {
      const choices = ['Convert 1 wood to 1 food + 1 grain', 'Skip']
      const selection = game.actions.choose(player, choices, {
        title: 'Ebonist',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.wood -= 1
        player.addResource('food', 1)
        player.addResource('grain', 1)
        game.log.add({
          template: '{player} converts 1 wood to 1 food + 1 grain (Ebonist)',
          args: { player },
        })
      }
    }
  },
}
