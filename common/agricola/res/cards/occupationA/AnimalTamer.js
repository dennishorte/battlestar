module.exports = {
  id: "animal-tamer-a086",
  name: "Animal Tamer",
  deck: "occupationA",
  number: 86,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get your choice of 1 wood or 1 grain. Instead of just 1 animal total, you can keep any 1 animal in each room of your house.",
  onPlay(game, player) {
    game.actions.offerResourceChoice(player, this, ['wood', 'grain'])
  },
  modifyHouseAnimalCapacity(player) {
    return player.getRoomCount()
  },
}
