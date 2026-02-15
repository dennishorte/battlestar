const t = require('../../../testutil_v2.js')

describe('Publican', () => {
  test('onAnyBeforeSow offers to give 1 grain to sowing player for 1 bonus point', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['publican-a132'],
        grain: 2,
      },
      micah: {
        grain: 1,
        food: 2,
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')  // micah → sow flow; before sow, Publican (dennis) offered
    t.choose(game, t.currentChoices(game).find(c => c.includes('grain') && c.includes('bonus point')))
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.choose(game, 'Forest')   // dennis
    t.choose(game, 'Clay Pit')  // micah

    t.testBoard(game, {
      dennis: {
        occupations: ['publican-a132'],
        grain: 1,       // 2 - 1 given to micah
        wood: 3,
        bonusPoints: 1,
      },
      micah: {
        grain: 1,       // received from Publican
        clay: 1,
        food: 2,
        farmyard: { fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }] },
      },
    })
  })

  test('allows skip', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      actionSpaces: ['Grain Utilization'],
      dennis: {
        occupations: ['publican-a132'],
        grain: 2,
      },
      micah: {
        grain: 1,
        farmyard: { fields: [{ row: 0, col: 2 }] },
      },
    })
    game.run()

    t.choose(game, 'Grain Utilization')
    t.choose(game, 'Skip')
    t.action(game, 'sow-field', { row: 0, col: 2, cropType: 'grain' })
    t.choose(game, 'Forest')   // dennis
    t.choose(game, 'Clay Pit') // micah

    t.testBoard(game, {
      dennis: { occupations: ['publican-a132'], grain: 2, wood: 3, bonusPoints: 0 },
      micah: { grain: 0, clay: 1, farmyard: { fields: [{ row: 0, col: 2, crop: 'grain', cropCount: 3 }] } },
    })
  })
})
