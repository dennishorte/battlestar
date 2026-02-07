module.exports = {
  id: "livestock-expert-e138",
  name: "Livestock Expert",
  deck: "occupationE",
  number: 138,
  type: "occupation",
  players: "1+",
  text: "If you play this card in round 11 or before, choose an animal type: you immediately get a number of animals of that type equal to the number you already have on your farm.",
  onPlay(game, player) {
    if (game.state.round <= 11) {
      game.actions.offerLivestockExpertChoice(player, this)
    }
  },
}
