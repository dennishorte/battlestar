module.exports = {
  id: "early-cattle-c083",
  name: "Early Cattle",
  deck: "minorC",
  number: 83,
  type: "minor",
  cost: {},
  vps: -3,
  prereqs: { pastures: 1 },
  category: "Livestock Provider",
  text: "When you play this card, you immediately get 2 cattle.",
  onPlay(game, player) {
    player.addAnimals('cattle', 2)
    game.log.add({
      template: '{player} gets 2 cattle from Early Cattle',
      args: { player },
    })
  },
}
