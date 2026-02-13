module.exports = {
  id: "stable-cleaner-c094",
  name: "Stable Cleaner",
  deck: "occupationC",
  number: 94,
  type: "occupation",
  players: "1+",
  text: "At any time, you can take the \"Build Stables\" action without placing a person. If you do, each stable costs you 1 wood and 1 food.",
  allowsAnytimeAction: true,
  getAnytimeActions(_game, player) {
    const cost = { wood: 1, food: 1 }
    if (player.getValidStableBuildSpaces().length === 0 || !player.canAffordCost(cost)) {
      return []
    }
    return [{
      type: 'card-custom',
      cardId: this.id,
      cardName: this.name,
      actionKey: 'activate',
      description: `${this.name}: Build stables (1 wood + 1 food each)`,
    }]
  },
  activate(game, player) {
    const cost = { wood: 1, food: 1 }

    while (player.getValidStableBuildSpaces().length > 0 && player.canAffordCost(cost)) {
      const validSpaces = player.getValidStableBuildSpaces()
      const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
      spaceChoices.push('Done')

      const selection = game.actions.choose(player, spaceChoices, {
        title: 'Stable Cleaner: Choose where to build a stable',
        min: 1,
        max: 1,
      })
      const sel = Array.isArray(selection) ? selection[0] : selection
      if (sel === 'Done') {
        break
      }

      const [row, col] = sel.split(',').map(Number)
      player.payCost(cost)
      player.buildStable(row, col)

      game.log.add({
        template: '{player} uses {card} to build a stable at ({row},{col})',
        args: { player, card: this, row, col },
      })
    }
  },
}
