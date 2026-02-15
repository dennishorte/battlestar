module.exports = {
  id: "stone-buyer-c143",
  name: "Stone Buyer",
  deck: "occupationC",
  number: 143,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you can immediately buy exactly 2 stone for 1 food. From the next round on, one per round, you can buy 1 stone for 2 food.",
  onPlay(game, player) {
    if (player.food >= 1) {
      const selection = game.actions.choose(player, () => [
        'Buy 2 stone for 1 food',
        'Skip',
      ], { title: 'Stone Buyer', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 1 })
        player.addResource('stone', 2)
        game.log.add({ template: '{player} buys 2 stone for 1 food from Stone Buyer', args: { player } })
      }
    }
  },
  onRoundStart(game, player) {
    if (player.food >= 2) {
      const selection = game.actions.choose(player, () => [
        'Buy 1 stone for 2 food',
        'Skip',
      ], { title: 'Stone Buyer', min: 1, max: 1 })
      if (selection[0] !== 'Skip') {
        player.payCost({ food: 2 })
        player.addResource('stone', 1)
        game.log.add({ template: '{player} buys 1 stone for 2 food from Stone Buyer', args: { player } })
      }
    }
  },
}
