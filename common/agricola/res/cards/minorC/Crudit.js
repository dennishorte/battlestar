module.exports = {
  id: "crudite-c057",
  name: "Crudité",
  deck: "minorC",
  number: 57,
  type: "minor",
  cost: {},
  category: "Food Provider",
  text: "When you play this card, you can immediately buy exactly 1 vegetable for 3 food. At any time, you can discard 1 vegetable on top of another vegetable in a field to get 4 food.",
  allowsAnytimeAction: true,

  onPlay(game, player) {
    if (player.food >= 3) {
      const selection = game.actions.choose(player, [
        game.actions.option({ id: 'buy', title: 'Buy 1 vegetable for 3 food' }),
        game.actions.option({ id: 'skip', title: 'Skip' }),
      ], {
        title: 'Crudité',
        min: 1,
        max: 1,
      })
      if (selection[0].id !== 'skip') {
        player.payCost({ food: 3 })
        player.addResource('vegetables', 1)
        game.log.add({
          template: '{player} buys 1 vegetable using {card}',
          args: { player, card: this },
        })
      }
    }
  },

  getAnytimeActions(game, player) {
    const vegFields = player.getFieldSpaces().filter(f => f.crop === 'vegetables' && f.cropCount >= 2)
    if (vegFields.length === 0) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'harvestVegetable',
      description: `${this.name}: Discard 1 vegetable from field for 4 food`,
    }]
  },

  harvestVegetable(game, player) {
    const vegFields = player.getFieldSpaces().filter(f => f.crop === 'vegetables' && f.cropCount >= 2)

    let targetField
    if (vegFields.length === 1) {
      targetField = vegFields[0]
    }
    else {
      const choices = vegFields.map(f =>
        game.actions.option({
          id: `space-${f.row}-${f.col}`,
          title: `${f.row},${f.col} (vegetables x${f.cropCount})`,
        })
      )
      const selection = game.actions.choose(player, choices, {
        title: 'Crudité: Choose a field',
        min: 1,
        max: 1,
      })
      const m = selection[0].id.match(/^space-(\d+)-(\d+)$/)
      const row = Number(m[1])
      const col = Number(m[2])
      targetField = vegFields.find(f => f.row === row && f.col === col)
    }

    const cell = player.farmyard.grid[targetField.row][targetField.col]
    cell.cropCount -= 1

    player.addResource('food', 4)

    game.log.add({
      template: '{player} uses {card} to discard 1 vegetable from field for 4 food',
      args: { player, card: this },
    })
  },
}
