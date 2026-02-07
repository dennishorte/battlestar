module.exports = {
  id: "moonshine-b003",
  name: "Moonshine",
  deck: "minorB",
  number: 3,
  type: "minor",
  cost: {},
  prereqs: { occupationsInHand: 1 },
  category: "Actions Booster",
  text: "Determine a random occupation in your hand. Immediately play it for an occupation cost of 2 food or give it to the player to your left.",
  onPlay(game, player) {
    game.actions.moonshineEffect(player, this)
  },
}
