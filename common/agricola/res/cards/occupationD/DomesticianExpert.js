module.exports = {
  id: "domestician-expert-d148",
  name: "Domestician Expert",
  deck: "occupationD",
  number: 148,
  type: "occupation",
  players: "1+",
  text: "You can keep 2 sheep on the border between each pair of orthogonally adjacent rooms.",
  holdsAnimals: { sheep: true },
  getAnimalCapacity(_game, player) {
    return player.getAdjacentRoomPairCount() * 2
  },
}
