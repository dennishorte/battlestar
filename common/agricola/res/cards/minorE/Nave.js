module.exports = {
  id: "nave-e032",
  name: "Nave",
  deck: "minorE",
  number: 32,
  type: "minor",
  cost: { stone: 2, reed: 1 },
  text: "During scoring, you get 1 bonus point for each of the 5 columns of your farmyard board containing at least one room.",
  getEndGamePoints(player) {
    const columnsWithRooms = player.getColumnsWithRooms()
    return columnsWithRooms
  },
}
