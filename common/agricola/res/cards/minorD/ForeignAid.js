module.exports = {
  id: "foreign-aid-d050",
  name: "Foreign Aid",
  deck: "minorD",
  number: 50,
  type: "minor",
  cost: {},
  prereqs: { maxRound: 11 },
  category: "Food Provider",
  text: "When you play this card, you immediately get 6 food. You may no longer use the action spaces of rounds 12 to 14.",
  onPlay(game, player) {
    player.addResource('food', 6)
    player.foreignAidRestriction = true
    game.log.add({
      template: '{player} gets 6 food from {card}',
      args: { player , card: this},
    })
  },
}
