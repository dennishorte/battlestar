const t = require('../../../testutil.js')

describe('Milk Jug (A050)', () => {
  test('gives card owner 3 food when any player uses cattle market', () => {
    const game = t.fixture({ cardSets: ['minorA'] })
    t.setBoard(game, {
      dennis: {
        food: 0,
        minorImprovements: ['milk-jug-a050'],
      },
      micah: {
        food: 0,
      },
    })
    game.run()

    const dennis = t.player(game)
    const micah = game.players.byName('micah')

    // Set up cattle action space
    game.state.actionSpaces['take-cattle'] = { accumulated: 1 }

    // Micah takes cattle action
    game.actions.executeAction(micah, 'take-cattle')

    // Dennis (card owner) gets 3 food
    expect(dennis.food).toBe(3)
    // Micah gets 1 food from Milk Jug
    expect(micah.food).toBe(1)
  })
})
