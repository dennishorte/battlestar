const t = require('../../../testutil_v2.js')

describe('SpecialFood', () => {
  test('gives bonus points when all animals accommodated', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['special-food-b034'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }] }],
        },
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      const player = game.players.byName('dennis')
      player.specialFoodActive = true
      game.state.actionSpaces['take-sheep'].accumulated = 3
    })
    game.run()

    // Dennis takes Sheep Market: 3 sheep. Pasture can hold 4 → all accommodated
    t.choose(game, 'Sheep Market')

    t.testBoard(game, {
      dennis: {
        bonusPoints: 3,
        animals: { sheep: 3 },
        minorImprovements: ['special-food-b034'],
        farmyard: {
          pastures: [{ spaces: [{ row: 0, col: 1 }, { row: 0, col: 2 }], sheep: 3 }],
        },
      },
    })
  })

  test('no bonus points when animals cannot be accommodated', () => {
    const game = t.fixture({ cardSets: ['minorImprovementB', 'occupationA', 'test'] })
    t.setBoard(game, {
      firstPlayer: 'dennis',
      dennis: {
        minorImprovements: ['special-food-b034'],
        // No pastures → can only hold 1 pet sheep
      },
      micah: { food: 10 },
      actionSpaces: ['Sheep Market'],
    })
    game.testSetBreakpoint('replenish-complete', (game) => {
      const player = game.players.byName('dennis')
      player.specialFoodActive = true
      game.state.actionSpaces['take-sheep'].accumulated = 3
    })
    game.run()

    // Dennis takes Sheep Market: 3 sheep but can only hold 1 (pet) → not all accommodated
    t.choose(game, 'Sheep Market')
    // Handle overflow prompt — release unhoused animals
    t.choose(game, 'Release')

    const dennis = game.players.byName('dennis')
    expect(dennis.bonusPoints || 0).toBe(0)
  })
})
