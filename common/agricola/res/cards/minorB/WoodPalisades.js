module.exports = {
  id: "wood-palisades-b030",
  name: "Wood Palisades",
  deck: "minorB",
  number: 30,
  type: "minor",
  cost: { food: 1 },
  category: "Points Provider",
  text: "Instead of a fence piece, you can place 2 wood on fence spaces at the edge of your farmyard. These fence spaces with 2 wood are worth 1 bonus point.",
  allowWoodPalisades: true,
  getEndGamePoints(player) {
    return player.farmyard.palisades.length
  },
}
