module.exports = {
  id: "basketmakers-wife-c139",
  name: "Basketmaker's Wife",
  deck: "occupationC",
  number: 139,
  type: "occupation",
  players: "3+",
  text: "When you play this card, you immediately get 1 reed and 1 food. At any time, you can turn 1 reed into 2 food.",
  allowsAnytimeConversion: {
    from: { reed: 1 },
    to: { food: 2 },
  },
  onPlay(game, player) {
    player.addResource('reed', 1)
    player.addResource('food', 1)
    game.log.add({
      template: "{player} gets 1 reed and 1 food from Basketmaker's Wife",
      args: { player },
    })
  },
}
