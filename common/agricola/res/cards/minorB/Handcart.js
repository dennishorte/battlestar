module.exports = {
  id: "handcart-b081",
  name: "Handcart",
  deck: "minorB",
  number: 81,
  type: "minor",
  cost: { wood: 1 },
  category: "Building Resource Provider",
  text: "Before the start of each work phase, you can take 1 building resource from a wood/clay/reed/stone accumulation space with at least 6/5/4/4 building resources of the same type. You can only take 1 resource per round.",
  onWorkPhaseStart(game, player) {
    game.actions.offerHandcart(player, this)
  },
}
