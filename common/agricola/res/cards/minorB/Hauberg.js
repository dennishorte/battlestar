module.exports = {
  id: "hauberg-b041",
  name: "Hauberg",
  deck: "minorB",
  number: 41,
  type: "minor",
  cost: { food: 3 },
  prereqs: { occupations: 3 },
  category: "Building Resource Provider",
  text: "Alternate placing 2 wood and 1 wild boar on the next 4 round spaces. You decide what to start with. At the start of these rounds, you get the goods.",
  onPlay(game, player) {
    const card = this
    const currentRound = game.state.round

    const selection = game.actions.choose(player, ['Start with wood', 'Start with boar'], {
      title: 'Hauberg: Choose what to start with',
      min: 1,
      max: 1,
    })

    const sel = Array.isArray(selection) ? selection[0] : selection
    const startWithWood = sel === 'Start with wood'

    for (let i = 0; i < 4; i++) {
      const round = currentRound + 1 + i
      if (round > 14) {
        break
      }

      const isWoodRound = startWithWood ? (i % 2 === 0) : (i % 2 === 1)
      if (isWoodRound) {
        game.scheduleResource(player, 'wood', round, 2)
      }
      else {
        game.scheduleResource(player, 'boar', round, 1)
      }
    }

    game.log.add({
      template: '{player} uses {card} to schedule alternating wood and boar for 4 rounds (starting with {start})',
      args: { player, card, start: startWithWood ? 'wood' : 'boar' },
    })
  },
}
