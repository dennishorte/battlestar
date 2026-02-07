module.exports = {
  id: "cow-prince-c134",
  name: "Cow Prince",
  deck: "occupationC",
  number: 134,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each space in your farmyard (including rooms) holding at least 1 cattle.",
  getEndGamePoints(player) {
    return player.getSpacesWithCattle()
  },
}
