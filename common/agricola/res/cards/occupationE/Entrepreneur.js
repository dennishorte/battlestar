module.exports = {
  id: "entrepreneur-e162",
  name: "Entrepreneur",
  deck: "occupationE",
  number: 162,
  type: "occupation",
  players: "1+",
  text: "At the start of each round, you can move 1 food to this card or discard 1 food from it. If you do either, you get 1 building resource of a type you currently do not have.",
  onPlay(_game, _player) {
    this.food = 0
  },
  onRoundStart(game, player) {
    game.actions.offerEntrepreneurChoice(player, this)
  },
}
