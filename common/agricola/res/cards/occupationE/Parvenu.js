module.exports = {
  id: "parvenu-e145",
  name: "Parvenu",
  deck: "occupationE",
  number: 145,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 7 or before, choose clay or reed: you immediately get a number of that building resource equal to the number you already have in your supply.",
  onPlay(game, player) {
    if (game.state.round <= 7) {
      game.actions.offerParvenuChoice(player, this)
    }
  },
}
