const t = require('../../../testutil_v2.js')

describe('Riverine Shepherd', () => {
  test('onAction takes 1 reed from Reed Bank when using Sheep Market', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market', 'Reed Bank'],
      dennis: {
        occupations: ['riverine-shepherd-a137'],
      },
    })
    game.testSetBreakpoint('initialization-complete', (game) => {
      game.state.actionSpaces['take-reed'].accumulated = 2
    })
    game.run()

    t.choose(game, 'Sheep Market')  // dennis: 1 sheep + 1 reed from Riverine Shepherd

    t.testBoard(game, {
      dennis: {
        occupations: ['riverine-shepherd-a137'],
        reed: 1,
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })

  test('onAction takes 1 sheep from Sheep Market when using Reed Bank', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      actionSpaces: ['Sheep Market', 'Reed Bank'],
      dennis: {
        occupations: ['riverine-shepherd-a137'],
      },
    })
    game.run()

    t.choose(game, 'Reed Bank')  // dennis: 1 reed + 1 sheep from Riverine Shepherd

    t.testBoard(game, {
      dennis: {
        occupations: ['riverine-shepherd-a137'],
        reed: 1,
        pet: 'sheep',
        animals: { sheep: 1 },
      },
    })
  })
})
