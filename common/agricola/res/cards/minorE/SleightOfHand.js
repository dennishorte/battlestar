module.exports = {
  id: "sleight-of-hand-e078",
  name: "Sleight of Hand",
  deck: "minorE",
  number: 78,
  type: "minor",
  cost: {},
  prereqs: { occupations: 3 },
  text: "When you play this card, you can immediately exchange up to 4 building resources for an equal number of other building resources.",
  onPlay(game, player) {
    const buildingResources = ['wood', 'clay', 'reed', 'stone']

    for (let i = 0; i < 4; i++) {
      const canGive = buildingResources.filter(r => player[r] > 0)
      if (canGive.length === 0) {
        break
      }

      const choices = []
      for (const give of canGive) {
        for (const get of buildingResources) {
          if (give !== get) {
            choices.push(`${give} \u2192 ${get}`)
          }
        }
      }
      choices.push('Done')

      const selection = game.actions.choose(player, choices, {
        title: `Sleight of Hand (${i + 1}/4)`,
        min: 1,
        max: 1,
      })

      if (selection[0] === 'Done') {
        break
      }

      const parts = selection[0].split(' \u2192 ')
      const give = parts[0]
      const get = parts[1]
      player.addResource(give, -1)
      player.addResource(get, 1)
      game.log.add({
        template: '{player} exchanges 1 {give} for 1 {get} using {card}',
        args: { player, give, get, card: this },
      })
    }
  },
}
