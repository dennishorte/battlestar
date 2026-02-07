module.exports = {
  id: "farmstead-c048",
  name: "Farmstead",
  deck: "minorC",
  number: 48,
  type: "minor",
  cost: {},
  prereqs: { occupations: 1 },
  category: "Food Provider",
  text: "After each turn in which you make at least one unused farmyard space used, you get 1 food.",
  onUseFarmyardSpace(game, player) {
    player.addResource('food', 1)
    game.log.add({
      template: '{player} gets 1 food from Farmstead',
      args: { player },
    })
  },
}
