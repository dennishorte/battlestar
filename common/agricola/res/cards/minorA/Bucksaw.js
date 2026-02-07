module.exports = {
  id: "bucksaw-a037",
  name: "Bucksaw",
  deck: "minorA",
  number: 37,
  type: "minor",
  cost: { wood: 1 },
  category: "Points Provider",
  text: "Each time you renovate, you can also pay 1 wood to get 1 bonus point and 1 grain.",
  onRenovate(game, player) {
    if (player.wood >= 1) {
      game.actions.offerBucksaw(player, this)
    }
  },
}
