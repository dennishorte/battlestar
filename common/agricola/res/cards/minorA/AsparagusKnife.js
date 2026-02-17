module.exports = {
  id: "asparagus-knife-a058",
  name: "Asparagus Knife",
  deck: "minorA",
  number: 58,
  type: "minor",
  cost: { wood: 1 },
  category: "Crop Provider",
  text: "In the returning home phase of rounds 8, 10, and 12, you can take 1 vegetable from exactly 1 vegetable field. You can immediately exchange it for 3 food and 1 bonus point.",
  onReturnHome(game, player) {
    const round = game.state.round
    if ((round === 8 || round === 10 || round === 12) && player.getVegetableFieldCount() > 0) {
      const card = this
      const hasVeg = player.getFieldSpaces().some(f => f.crop === 'vegetables' && f.cropCount > 0)
      if (!hasVeg) {
        return
      }

      const choices = [
        'Take 1 vegetable from field for 3 food and 1 bonus point',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Harvest vegetable for food and bonus point?`,
        min: 1,
        max: 1,
      })

      if (selection[0] !== 'Skip') {
        const field = player.getFieldSpaces().find(f => f.crop === 'vegetables' && f.cropCount > 0)
        const space = player.getSpace(field.row, field.col)
        space.cropCount -= 1
        if (space.cropCount === 0) {
          space.crop = null
        }
        player.addResource('food', 3)
        player.addBonusPoints(1)
        game.log.add({
          template: '{player} takes 1 vegetable from a field for 3 food and 1 bonus point using {card}',
          args: { player, card },
        })
      }
    }
  },
}
