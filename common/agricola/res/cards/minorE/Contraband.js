module.exports = {
  id: "contraband-e054",
  name: "Contraband",
  deck: "minorE",
  number: 54,
  type: "minor",
  cost: { food: 1 },
  text: "Each time you play or build an improvement after this, you can pay 1 additional building resource of a type in the printed cost to get 3 food.",
  onPlayImprovement(game, player, card) {
    if (card.id !== this.id && card.cost) {
      game.actions.offerContraband(player, this, card)
    }
  },
}
