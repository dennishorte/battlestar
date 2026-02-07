module.exports = {
  id: "storeroom-d031",
  name: "Storeroom",
  deck: "minorD",
  number: 31,
  type: "minor",
  cost: { wood: 1, stone: 2 },
  vps: 1,
  category: "Points Provider",
  text: "During scoring, you get ½ bonus point for each pair of grain plus vegetable you have (considering all crops in your supply and fields), rounded up.",
  getEndGamePoints(player) {
    const totalGrain = player.grain + player.getGrainInFields()
    const totalVegetables = player.vegetables + player.getVegetablesInFields()
    const pairs = Math.min(totalGrain, totalVegetables)
    return Math.ceil(pairs / 2)
  },
}
