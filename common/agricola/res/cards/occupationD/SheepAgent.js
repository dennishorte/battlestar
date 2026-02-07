module.exports = {
  id: "sheep-agent-d086",
  name: "Sheep Agent",
  deck: "occupationD",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "You can keep 1 sheep on each occupation card in front of you (including this one), unless it is already able to hold animals.",
  holdsAnimals: { sheep: true },
  getAnimalCapacity(player) {
    const occupations = player.getPlayedOccupations()
    return occupations.filter(o => !o.holdsAnimals || o.id === this.id).length
  },
}
