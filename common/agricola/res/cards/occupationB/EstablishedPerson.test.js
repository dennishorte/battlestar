const t = require('../../../testutil_v2.js')

describe('Established Person', () => {
  test('onPlay with exactly 2 rooms and can renovate: free renovate then build fences', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['established-person-b088'],
        roomType: 'wood',
        wood: 5,
        clay: 2,
        reed: 1,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Established Person')
    // Card renovates (wood→clay) then triggers buildFences. Cancel fencing (empty pasture = skip).
    const sel = game.waiting && game.waiting.selectors && game.waiting.selectors[0]
    if (sel && (sel.title || '').toLowerCase().includes('pasture')) {
      t.action(game, 'build-pasture', { spaces: [] })
    }
    if (game.waiting && game.waiting.selectors && game.waiting.selectors.length > 0) {
      const choices = t.currentChoices(game)
      const doneOpt = choices.find(c => c && String(c).includes('Done'))
      t.choose(game, doneOpt || choices[0])
    }
    if (game.waiting && game.waiting.selectors && game.waiting.selectors.length > 0) {
      t.choose(game, t.currentChoices(game)[0])
    }

    t.testBoard(game, {
      dennis: {
        occupations: ['established-person-b088'],
        roomType: 'clay',
        food: 1,
        wood: 5,
        clay: 2,
        reed: 1,
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
        },
      },
    })
  })

  test('onPlay with not 2 rooms does not renovate', () => {
    const game = t.fixture({ cardSets: ['occupationB', 'test'], numPlayers: 2 })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        hand: ['established-person-b088'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
    game.run()

    t.choose(game, 'Lessons A')
    t.choose(game, 'Established Person')

    t.testBoard(game, {
      dennis: {
        occupations: ['established-person-b088'],
        roomType: 'wood',
        farmyard: {
          rooms: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
        },
      },
    })
  })
})
