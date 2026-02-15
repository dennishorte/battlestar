module.exports = {
  id: "roof-ballaster-b123",
  name: "Roof Ballaster",
  deck: "occupationB",
  number: 123,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you can immediately pay 1 food to get 1 stone for each room you have.",
  onPlay(game, player) {
    if (player.food < 1) {
      return
    }
    const selection = game.actions.choose(player, [
      'Pay 1 food to get 1 stone per room',
      'Skip',
    ], {
      title: 'Roof Ballaster: Pay 1 food for 1 stone per room?',
      min: 1,
      max: 1,
    })
    if (selection[0] === 'Skip') {
      return
    }
    player.payCost({ food: 1 })
    const rooms = player.getRoomCount()
    player.addResource('stone', rooms)
    game.log.add({
      template: '{player} pays 1 food and gets {stone} stone from Roof Ballaster',
      args: { player, stone: rooms },
    })
  },
}
