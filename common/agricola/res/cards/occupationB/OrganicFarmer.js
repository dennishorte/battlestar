module.exports = {
  id: "organic-farmer-b098",
  name: "Organic Farmer",
  deck: "occupationB",
  number: 98,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each pasture containing at least 1 animal while having unused capacity for at least three more animals.",
  getEndGamePoints(player) {
    return player.getPasturesWithSpareCapacity(3)
  },
}
