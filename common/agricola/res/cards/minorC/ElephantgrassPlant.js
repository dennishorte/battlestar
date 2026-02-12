module.exports = {
  id: "elephantgrass-plant-c034",
  name: "Elephantgrass Plant",
  deck: "minorC",
  number: 34,
  type: "minor",
  cost: { clay: 2, stone: 1 },
  prereqs: { occupations: 2 },
  category: "Points Provider",
  text: "Immediately after each harvest, you can use this card to exchange exactly 1 reed for 1 bonus point.",
  onHarvestEnd(game, player) {
    if (player.reed >= 1) {
      const selection = game.actions.choose(player, [
        'Exchange 1 reed for 1 bonus point',
        'Skip',
      ], {
        title: 'Elephantgrass Plant',
        min: 1,
        max: 1,
      })
      if (selection[0] !== 'Skip') {
        player.payCost({ reed: 1 })
        player.bonusPoints = (player.bonusPoints || 0) + 1
        game.log.add({
          template: '{player} exchanges 1 reed for 1 bonus point using {card}',
          args: { player, card: this },
        })
      }
    }
  },
}
