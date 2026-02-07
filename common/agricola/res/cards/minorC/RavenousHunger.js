module.exports = {
  id: "ravenous-hunger-c042",
  name: "Ravenous Hunger",
  deck: "minorC",
  number: 42,
  type: "minor",
  cost: { grain: 1 },
  category: "Actions Booster",
  text: "Immediately after each time you use the \"Vegetable Seeds\" action space, you can place another person on an accumulation space and get 1 additional good of the accumulating type.",
  onAction(game, player, actionId) {
    if (actionId === 'take-vegetable') {
      game.actions.offerRavenousHunger(player, this)
    }
  },
}
