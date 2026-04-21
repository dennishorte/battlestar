const t = require('../testutil')

describe('Objective Card Player-Count Filtering', () => {

  test('objectives have valid battle icons', () => {
    const game = t.fixture()
    game.run()

    // Each player's objective should have a valid battle icon
    const validIcons = ['crysknife', 'desert-mouse', 'ornithopter', 'wild']
    for (const player of game.players.all()) {
      const objective = game.state.objectives?.[player.name]
      expect(objective).toBeDefined()
      expect(validIcons).toContain(objective.battleIcon)
    }
  })

  test('2-player game assigns objectives to both players', () => {
    const game = t.fixture({ numPlayers: 2 })
    game.run()

    const dennis = game.state.objectives?.dennis
    const micah = game.state.objectives?.micah
    expect(dennis).toBeDefined()
    expect(micah).toBeDefined()
  })

  test('4-player game assigns objectives to all four players', () => {
    const game = t.fixture({ numPlayers: 4 })
    game.run()

    for (const player of game.players.all()) {
      const obj = game.state.objectives?.[player.name]
      expect(obj).toBeDefined()
    }
  })
})
