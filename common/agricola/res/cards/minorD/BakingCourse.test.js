const res = require('../../index.js')

describe('Baking Course (D064)', () => {
  test('has baking conversion', () => {
    const card = res.getCardById('baking-course-d064')
    expect(card.bakingConversion).toEqual({ from: 'grain', to: 'food', rate: 2 })
  })

  test('triggers bake bread action at end of non-harvest round', () => {
    const card = res.getCardById('baking-course-d064')
    const bakeBreadCalled = []
    const game = {
      isHarvestRound: (round) => round === 4 || round === 7 || round === 9 || round === 11 || round === 14,
      actions: {
        bakeBread: (player) => {
          bakeBreadCalled.push(player)
        },
      },
    }
    const player = { name: 'dennis' }

    // Non-harvest round
    card.onRoundEnd(game, player, 3)
    expect(bakeBreadCalled).toHaveLength(1)
    expect(bakeBreadCalled[0]).toBe(player)
  })

  test('does not trigger bake bread action at end of harvest round', () => {
    const card = res.getCardById('baking-course-d064')
    const bakeBreadCalled = []
    const game = {
      isHarvestRound: (round) => round === 4 || round === 7 || round === 9 || round === 11 || round === 14,
      actions: {
        bakeBread: (player) => {
          bakeBreadCalled.push(player)
        },
      },
    }
    const player = { name: 'dennis' }

    // Harvest round
    card.onRoundEnd(game, player, 4)
    expect(bakeBreadCalled).toHaveLength(0)
  })

  test('has correct properties', () => {
    const card = res.getCardById('baking-course-d064')
    expect(card.cost).toEqual({})
    expect(card.prereqs).toEqual({ occupations: 1 })
  })
})
