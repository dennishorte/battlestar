module.exports = {
  id: "pole-barns-e001",
  name: "Pole Barns",
  deck: "minorE",
  number: 1,
  type: "minor",
  cost: { wood: 2 },
  prereqs: { fences: 15 },
  text: "You can immediately build up to 3 stables at no cost.",
  onPlay(game, player) {
    let built = 0
    for (let i = 0; i < 3; i++) {
      const validSpaces = player.getValidStableBuildSpaces()
      if (validSpaces.length === 0) {
        break
      }

      const spaceChoices = validSpaces.map(s => `${s.row},${s.col}`)
      spaceChoices.push('Skip')
      const selection = game.actions.choose(player, spaceChoices, {
        title: `Pole Barns: Build a free stable (${i + 1}/3)?`,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Skip') {
        break
      }

      const [row, col] = selection[0].split(',').map(Number)
      player.buildStable(row, col)
      built++
    }

    if (built > 0) {
      game.log.add({
        template: '{player} builds {count} free stable(s) using {card}',
        args: { player, count: built, card: this },
      })
    }
  },
}
