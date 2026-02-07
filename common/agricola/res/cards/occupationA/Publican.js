module.exports = {
  id: "publican-a132",
  name: "Publican",
  deck: "occupationA",
  number: 132,
  type: "occupation",
  players: "1+",
  text: "Each time before another player takes an unconditional \"Sow\" action, you can give them 1 grain from your supply to get 1 bonus point.",
  onAnyBeforeSow(game, actingPlayer, cardOwner) {
    if (actingPlayer.name !== cardOwner.name && cardOwner.grain >= 1) {
      game.actions.offerPublicanBonus(cardOwner, actingPlayer, this)
    }
  },
}
