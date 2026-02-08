const res = require('../../index.js')

describe('Zigzag Harrow (D001)', () => {
  test('triggers plow field with zigzag pattern on play', () => {
    const card = res.getCardById('zigzag-harrow-d001')
    const plowFieldCalled = []
    const game = {
      actions: {
        plowField: (player, opts) => {
          plowFieldCalled.push({ player, opts })
        },
      },
    }
    const player = { name: 'dennis' }

    card.onPlay(game, player)

    expect(plowFieldCalled).toHaveLength(1)
    expect(plowFieldCalled[0].opts).toEqual({ zigzagPattern: true })
  })

  test('has correct properties', () => {
    const card = res.getCardById('zigzag-harrow-d001')
    expect(card.cost).toEqual({ wood: 1 })
    expect(card.prereqs).toEqual({ fieldsInLShape: true })
  })
})
