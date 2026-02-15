const t = require('../../../testutil_v2.js')
const PigOwner = require('./PigOwner.js')

describe('Pig Owner', () => {
  // Card is 3+ players. checkTrigger: first time you have 5 wild boar → 3 bonus points (once only).

  test('checkTrigger: first time with 5 boar gives 3 bonus points', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pig-owner-a153'],
        bonusPoints: 0,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
            { spaces: [{ row: 2, col: 3 }] },
            { spaces: [{ row: 2, col: 4 }] },
          ],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    dennis.addAnimals('boar', 5)
    expect(dennis.getTotalAnimals('boar')).toBe(5)

    PigOwner.checkTrigger(game, dennis)

    expect(dennis.pigOwnerTriggered).toBe(true)
    expect(dennis.bonusPoints).toBe(3)
    t.choose(game, 'Forest') // consume first prompt so test completes
  })

  test('checkTrigger: does not trigger a second time', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pig-owner-a153'],
        bonusPoints: 0,
        farmyard: {
          pastures: [
            { spaces: [{ row: 2, col: 0 }] },
            { spaces: [{ row: 2, col: 1 }] },
            { spaces: [{ row: 2, col: 2 }] },
            { spaces: [{ row: 2, col: 3 }] },
            { spaces: [{ row: 2, col: 4 }] },
          ],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    dennis.addAnimals('boar', 5)

    PigOwner.checkTrigger(game, dennis)
    expect(dennis.bonusPoints).toBe(3)

    PigOwner.checkTrigger(game, dennis)
    expect(dennis.bonusPoints).toBe(3)
    t.choose(game, 'Forest')
  })

  test('checkTrigger: does not trigger with fewer than 5 boar', () => {
    const game = t.fixture({ cardSets: ['occupationA', 'test'], numPlayers: 3 })
    t.setBoard(game, {
      dennis: {
        occupations: ['pig-owner-a153'],
        bonusPoints: 0,
        farmyard: {
          pastures: [{ spaces: [{ row: 2, col: 0 }] }],
        },
      },
    })
    game.run()
    const dennis = game.players.byName('dennis')
    dennis.addAnimals('boar', 4)

    PigOwner.checkTrigger(game, dennis)

    expect(dennis.pigOwnerTriggered).toBeUndefined()
    expect(dennis.bonusPoints).toBe(0)
    t.choose(game, 'Forest')
  })
})
