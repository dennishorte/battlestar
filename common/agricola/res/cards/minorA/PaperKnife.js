module.exports = {
  id: "paper-knife-a003",
  name: "Paper Knife",
  deck: "minorA",
  number: 3,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { occupationsInHand: 3 },
  category: "Actions Booster",
  text: "Select 3 occupations in your hand. Select one of them randomly, which you can play immediately without paying an occupation cost.",
  onPlay(game, player) {
    game.actions.paperKnifeEffect(player, this)
  },
}
