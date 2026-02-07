module.exports = {
  id: "fellow-grazer-a099",
  name: "Fellow Grazer",
  deck: "occupationA",
  number: 99,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 2 bonus points for each pasture you have covering at least 3 farmyard spaces.",
  getEndGamePoints(player) {
    const largePastures = player.getPasturesWithMinSpaces(3)
    return largePastures * 2
  },
}
