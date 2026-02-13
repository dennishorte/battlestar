module.exports = {
  id: "bumper-crop-e025",
  name: "Bumper Crop",
  deck: "minorE",
  number: 25,
  type: "minor",
  cost: {},
  vps: 1,
  prereqs: { grainFields: 2 },
  text: "When you play this card, immediately play the field phase of the harvest on your farmyard only.",
  onPlay(game, player) {
    const result = player.harvestFields()
    const h = result.harvested
    const total = h.grain + h.vegetables + h.wood + h.stone
    if (total > 0) {
      game.log.add({
        template: '{player} harvests {grain} grain, {veg} vegetables using {card}',
        args: { player, grain: h.grain, veg: h.vegetables, card: this },
      })
    }
  },
}
