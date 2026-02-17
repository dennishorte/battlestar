module.exports = {
  id: "lifting-machine-a070",
  name: "Lifting Machine",
  deck: "minorA",
  number: 70,
  type: "minor",
  cost: { wood: 1 },
  prereqs: { fields: 3 },
  category: "Crop Provider",
  text: "At the end of each round that does not end with a harvest, you can move 1 vegetable from one of your fields to your supply. (This is not considered a field phase.)",
  onRoundEnd(game, player, round) {
    if (!game.isHarvestRound(round) && player.getVegetableFieldCount() > 0) {
      const card = this
      const hasVeg = player.getFieldSpaces().some(f => f.crop === 'vegetables' && f.cropCount > 0)
      if (!hasVeg) {
        return
      }

      const choices = [
        'Move 1 vegetable from field to supply',
        'Skip',
      ]
      const selection = game.actions.choose(player, choices, {
        title: `${card.name}: Move vegetable from field?`,
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
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} moves 1 vegetable from field to supply using {card}',
          args: { player, card },
        })
      }
    }
  },
}
