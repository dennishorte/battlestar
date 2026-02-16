const t = require('../../../testutil_v2.js')

describe('Oyster Eater', () => {
  test('gives 1 bonus point when other player uses Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'micah',
      dennis: {
        occupations: ['oyster-eater-d134'],
      },
    })
    game.run()

    // Turn order: micah(Fishing), [dennis skip], micah, dennis, dennis
    t.choose(game, 'Fishing')        // micah uses Fishing → dennis gets 1 BP + skip
    t.choose(game, 'Forest')         // micah's 2nd worker
    t.choose(game, 'Day Laborer')    // dennis's 1st worker (skip was consumed)
    t.choose(game, 'Grain Seeds')    // dennis's 2nd worker

    t.testBoard(game, {
      dennis: {
        food: 2,        // from Day Laborer
        grain: 1,       // from Grain Seeds
        bonusPoints: 1, // from Oyster Eater
        occupations: ['oyster-eater-d134'],
      },
      micah: {
        food: 1,  // from Fishing (1 accumulated)
        wood: 3,  // from Forest (3 accumulated)
      },
    })
  })

  test('gives bonus point when owner uses Fishing', () => {
    const game = t.fixture({ cardSets: ['occupationD'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        occupations: ['oyster-eater-d134'],
      },
    })
    game.run()

    // Turn order: dennis(Fishing), micah, [dennis skip], micah, dennis
    t.choose(game, 'Fishing')        // dennis uses Fishing → dennis gets 1 BP + skip
    t.choose(game, 'Forest')         // micah's 1st worker
    t.choose(game, 'Day Laborer')    // micah's 2nd worker (dennis was skipped)
    t.choose(game, 'Grain Seeds')    // dennis's 2nd worker

    t.testBoard(game, {
      dennis: {
        food: 1,        // from Fishing (1 accumulated)
        grain: 1,       // from Grain Seeds
        bonusPoints: 1, // from Oyster Eater
        occupations: ['oyster-eater-d134'],
      },
      micah: {
        wood: 3,  // from Forest
        food: 2,  // from Day Laborer
      },
    })
  })
})
