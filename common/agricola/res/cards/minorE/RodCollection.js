module.exports = {
  id: "rod-collection-e038",
  name: "Rod Collection",
  deck: "minorE",
  number: 38,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { occupations: 3 },
  text: "Each time you use \"Fishing\", you can place up to 2 wood on this card, irretrievably. During scoring, each such wood is worth 1 bonus point, except the 1st, 4th, 7th, and 10th.",
  storedResource: "wood",
  onAction(game, player, actionId) {
    if (actionId === 'fishing') {
      game.actions.offerRodCollection(player, this)
    }
  },
  getEndGamePoints(_player) {
    const stored = this.stored || 0
    // Exclude 1st, 4th, 7th, 10th (indices 0, 3, 6, 9)
    let points = 0
    for (let i = 1; i <= stored; i++) {
      if (i !== 1 && i !== 4 && i !== 7 && i !== 10) {
        points++
      }
    }
    return points
  },
}
