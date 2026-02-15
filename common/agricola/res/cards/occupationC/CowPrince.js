module.exports = {
  id: "cow-prince-c134",
  name: "Cow Prince",
  deck: "occupationC",
  number: 134,
  type: "occupation",
  players: "1+",
  text: "During scoring, you get 1 bonus point for each space in your farmyard (including rooms) holding at least 1 cattle.",
  getEndGamePoints(player) {
    let count = 0
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        const space = player.getSpace(row, col)
        if (space && space.cattle && space.cattle > 0) {
          count++
        }
      }
    }
    return count
  },
}
