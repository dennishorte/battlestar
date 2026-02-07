module.exports = {
  id: "clay-firer-d162",
  name: "Clay Firer",
  deck: "occupationD",
  number: 162,
  type: "occupation",
  players: "1+",
  text: "When you play this card, you immediately get 2 clay. At any time, you can turn clay into stone: you get 1 stone for 2 clay, and 2 stone for 3 clay.",
  allowsAnytimeConversion: [
    {
      from: { clay: 2 },
      to: { stone: 1 },
    },
    {
      from: { clay: 3 },
      to: { stone: 2 },
    },
  ],
  onPlay(game, player) {
    player.addResource('clay', 2)
    game.log.add({
      template: '{player} gets 2 clay from Clay Firer',
      args: { player },
    })
  },
}
