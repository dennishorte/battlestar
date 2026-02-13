module.exports = {
  id: "harvest-festival-planning-c072",
  name: "Harvest Festival Planning",
  deck: "minorC",
  number: 72,
  type: "minor",
  cost: { food: 1 },
  prereqs: { occupations: 2 },
  category: "Actions Booster",
  text: "When you play this card, immediately carry out the field phase of the harvest. Afterwards, you get a \"Major or Minor Improvement\" action.",
  onPlay(game, player) {
    // Immediate field phase harvest
    const result = player.harvestFields()
    const h = result.harvested
    if (h.grain > 0 || h.vegetables > 0) {
      game.log.add({
        template: '{player} harvests {grain} grain, {veg} vegetables using {card}',
        args: { player, grain: h.grain, veg: h.vegetables, card: this },
      })
    }

    // Then offer Major or Minor Improvement action
    game.actions.buildImprovement(player)
  },
}
